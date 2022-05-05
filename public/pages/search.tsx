import { useEffect, useState } from 'react';
import classNames from 'classnames';

import { usePrevious } from '../hooks/usePrevious';
import { useSearch } from '../providers/SearchProvider';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';

// Search components
import TextResult from '../components/search/TextResult';
import Pagination from '../components/search/Pagination';
import RelatedSearches from '../components/search/RelatedSearches';
import QueryMeta from '../components/search/QueryMeta';

// Search states
import NoSearchResults from '../components/search/states/NoSearchResults';
import ResultsLoading from '../components/search/states/ResultsLoading';
import SearchError from '../components/search/states/SearchError';
import EmptyQuery from '../components/search/states/EmptyQuery';
import RateLimited from '../components/search/states/RateLimited';

// Extra components
import Notice from '../components/Notice';

// Services
import searchAPI from '../services/search';
import suggestionAPI from '../services/suggestions';

// Data
import { notices } from '../data/notices';

// Types
import type { Result } from '../types/Search';
import type { APIError } from '../services/err';

const SearchPage = () => {
	const [results, setResults] = useState<Result[] | undefined>(undefined);
	const [err, setErr] = useState<APIError | false>(false);
	const [dym, setDym] = useState('');
	const [srf, setSrf] = useState('');
	const [rateLimited, setRateLimited] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const params = new URLSearchParams(window.location.search);

	if (!params.has('q') || params.get('q')?.trim() === '') {
		console.error('No query');
	}

	const query = params.get('q') || '';
	const page = Number(params.get('p')) || 1;

	const previousQuery = usePrevious(query);
	const previousPage = usePrevious(page);
	
	const { query: savedQuery, setQuery } = useSearch();
	const [staticQuery, setStaticQuery] = useState(query);
	const [staticSuggestions, setStaticSuggestions] = useState([]);

	useEffect(() => {
		// Manually update the query state interally
		// so that all nested components have up-to-date
		// data.
		if (query && query !== savedQuery) {
			setQuery(query);
		}
	}, [query]);

	useEffect(() => {
		if (query !== previousQuery || page !== previousPage) {
			setResults(undefined);
			setLoaded(false);
			setStaticQuery(query);

			searchAPI
			.getSearchResults(query, page)
			.then(data => {
					setLoaded(true);

					if (data.type === 'success' && data.data) {
						if (Array.isArray(data.data.Links)) {
							setResults(data.data.Links);
						} else {
							setResults([]);
						}

						setRateLimited(data.data.RateLimited);
						setDym(data.data?.DYM);
						setSrf(data.data?.SRF);
					} else {
						setResults([]);
						setErr(data.errorType);
					}
				});
		}
	}, [query, page, previousQuery, previousPage]);

	useEffect(() => {
		suggestionAPI
			.getSuggestions(staticQuery)
			.then(data => {
				if (data.type === 'empty') {
					setStaticSuggestions([]);
					return [];
				}
	
				if (data.type === 'success' && data.data && data.data.length  === 2) {
					setStaticSuggestions(data.data[1]);
					return data;
				}
	
				setStaticSuggestions([]);
				return [];
			})
	}, [staticQuery]);

	if (err) {
		return <SearchError err={err} />;
	}

	if (rateLimited) {
		return <RateLimited />;
	}

	if (query.trim().length === 0) {
		return <EmptyQuery />;
	}

	return (
		<div className={classNames('flex align-c dark-ui')}>
			<PageTitle>{query} - Gofë</PageTitle>

			<div className="search-panel">
				<div className="grid-block w-100p flex-c">
					<div className="results">
						<QueryMeta
							dym={dym}
							srf={srf}
							setQuery={setQuery}
						/>

						{results ? (
							<>
								{results.map(result => <TextResult key={result.URL} {...result} />)}
							</>
						) : (
							<ResultsLoading />
						)}

						{results?.length === 0 && loaded && (
							<NoSearchResults query={query} />
						)}
					</div>
				</div>

				<div className="grid-block">
					<div className="mb-2r">
						{
							notices &&
							notices
							.filter(e => e.type === 'search')
							.map(e => <Notice key={e.id} {...e} />)
						}
					</div>
					<RelatedSearches staticQuery={staticQuery} suggestions={staticSuggestions} />
				</div>

				<div className="grid-block">
					{results && results.length !== 0 && loaded && (
						<Pagination page={Number(page) || 1} staticQuery={staticQuery} />
					)}
				</div>
			</div>
		</div>
	);
};

SearchPage.layout = Layout;

export default SearchPage;