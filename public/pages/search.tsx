import { useEffect, useState } from 'react';
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

import searchAPI from '../services/search';

import type { Result } from '../types/Search';
import { APIError } from '../services/err';


interface Props {
	query: string;
	page: number;
}

const SearchPage = ({ query, page }: Props) => {
	const [results, setResults] = useState<Result[] | undefined>(undefined);
	const [err, setErr] = useState<APIError | false>(false);

	const previousQuery = usePrevious(query);
	const previousPage = usePrevious(page);
	const { query: savedQuery, setQuery } = useQuery();

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

			searchAPI
				.getSearchResults(query, page || 1)
				.then(data => {
					if (data.type === 'success' && data.data && Array.isArray(data.data)) {
						setResults(data.data);
					} else {
						setResults([]);
						console.log({data})
						setErr(data.errorType);
					}
				});
		}
	}, [query, page, previousQuery, previousPage]);

	if (err) {
		return <SearchError err={err} />;
	}

	if (!results) {
		return <ResultsLoading />;
	}

	if (results.length === 0) {
		return <NoSearchResults query={query} />;
	}

	return (
		<div className={classNames('flex align-c dark-ui')}>
			<PageTitle>{query} - Gofë</PageTitle>

			<div className="results">
				{results.map(result => <TextResult key={result.URL} {...result} />)}
				<RelatedSearches />
				<Pagination page={Number(page) || 1} />
			</div>
		</div>
	);
};

const getServerSideProps = async (context: any) => {
	const query = context?.query?.q;
	const page = context?.query?.p || 1;

	if (!query || !Boolean(query)) return { props: { query: null, page: 1 } };

	return {
		props: {
			query,
			page: Number(page) || 1,
		}
	}
}

SearchPage.layout = Layout;

export default SearchPage;

export {
	getServerSideProps,
}
