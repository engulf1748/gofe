import { useEffect, useState } from 'react';
import classNames from 'classnames';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';
import TextResult from '../components/search/TextResult';
import NoSearchResults from '../components/search/states/NoSearchResults';
import ResultsLoading from '../components/search/states/ResultsLoading';
import Pagination from '../components/search/Pagination';

import searchAPI from '../services/search';

import type { Result } from '../types/Search';
import { usePrevious } from '../hooks/usePrevious';
import { useQuery } from '../providers/QueryProvider';


interface Props {
	query: string;
	page: number;
}

const SearchPage = ({ query, page }: Props) => {
	const [results, setResults] = useState<Result[] | undefined>(undefined);
	const previousQuery = usePrevious(query);
	const previousPage = usePrevious(page);
	const { query: savedQuery, setQuery } = useQuery();

	// TODO:
	// We need to check the validity of the query
	// here and show an error if it's null.

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
				.then(data => data)
				.catch(err => {
					console.error(err);
					setResults([]);
				})
				.then(data => {
					if (data) {
						setResults(data);
					}
				});
		}
	}, [query, page, previousQuery, previousPage]);

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
