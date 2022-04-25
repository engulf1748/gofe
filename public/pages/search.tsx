import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import { usePrevious } from '../hooks/usePrevious';
import { useQuery } from '../providers/QueryProvider';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';
import TextResult from '../components/search/TextResult';
import NoSearchResults from '../components/search/states/NoSearchResults';
import ResultsLoading from '../components/search/states/ResultsLoading';
import Pagination from '../components/search/Pagination';
import SearchError from '../components/search/states/SearchError';
import RelatedSearches from '../components/search/RelatedSearches';
import EmptyQuery from '../components/search/states/EmptyQuery';
import RateLimited from '../components/search/states/RateLimited';

import searchAPI from '../services/search';

import type { Result } from '../types/Search';
import type { APIError } from '../services/err';


interface QueryMetaProps {
	dym: string;
	srf: string;
	setQuery(v: string): void;
}

const QueryMeta = ({ dym, srf, setQuery }: QueryMetaProps) => {
	const { push } = useRouter();

	const searchFor = (newQuery: string) => {
		setQuery(newQuery);
		push(`/search?q=${newQuery}`);
	}

	if (dym) {
		return (
			<div className="mb-2r">
				<p>Did you mean <a className='g-link' onClick={() => searchFor(dym)}>{dym.trim()}?</a></p>
			</div>
		);
	}

	if (srf) {
		return (
			<div className="mb-2r">
				<p>Showing results for <span className='fw-600'>{srf.trim()}</span></p>
			</div>
		);
	}

	return <div className='h-1r'></div>;
}

const SearchPage = () => {
	const [results, setResults] = useState<Result[] | undefined>(undefined);
	const [err, setErr] = useState<APIError | false>(false);
	const [dym, setDym] = useState('');
	const [srf, setSrf] = useState('');
	const [rateLimited, setRateLimited] = useState(false);

	const params = new URLSearchParams(window.location.search);

	if (!params.has('q') || params.get('q')?.trim() === '') {
		console.error('No query');
	}

	const query = params.get('q') || '';
	const page = Number(params.get('p')) || 1;

	const previousQuery = usePrevious(query);
	const previousPage = usePrevious(page);
	const { query: savedQuery, setQuery } = useQuery();
	const [staticQuery, setStaticQuery] = useState(query);

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
			setStaticQuery(query);

			searchAPI
				.getSearchResults(query, page)
				.then(data => {
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

	if (err) {
		return <SearchError err={err} />;
	}

	if (rateLimited) {
		return <RateLimited />;
	}

	if (!results) {
		return <ResultsLoading />;
	}

	if (query.trim().length === 0) {
		return <EmptyQuery />;
	}

	if (results.length === 0) {
		return <NoSearchResults query={query} />;
	}

	return (
		<div className={classNames('flex align-c dark-ui')}>
			<PageTitle>{query} - Gofë</PageTitle>

			<div className="search-panel">
				<div className="results">
					<QueryMeta
						dym={dym}
						srf={srf}
						setQuery={setQuery}
					/>

					{results.map(result => <TextResult key={result.URL} {...result} />)}
				</div>

				<div className="grid-block">
					<RelatedSearches />
				</div>

				<div className="grid-block">
					<Pagination page={Number(page) || 1} staticQuery={staticQuery} />
				</div>
			</div>
		</div>
	);
};

SearchPage.layout = Layout;

export default SearchPage;