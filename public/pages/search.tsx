import { useEffect, useState } from 'react';
import classNames from 'classnames';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';
import TextResult from '../components/search/TextResult';
import NoSearchResults from '../components/search/states/NoSearchResults';
import ResultsLoading from '../components/search/states/ResultsLoading';

import searchAPI from '../services/search';

import type { Result } from '../types/Search';
import { usePrevious } from '../hooks/usePrevious';


interface Props {
	query: string;
}

const SearchPage = ({ query }: Props) => {
	const [results, setResults] = useState<Result[] | undefined>(undefined);
	const previousQuery = usePrevious(query);

	// TODO:
	// We need to check the validity of the query
	// here and show an error if it's null.

	useEffect(() => {
		if (query !== previousQuery) {
			setResults(undefined);

			searchAPI
				.getSearchResults(query)
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
	}, [query]);

	if (!results) {
		return <ResultsLoading />;
	}

	if (results.length === 0) {
		return <NoSearchResults query={query} />;
	}

	return (
		<div className={classNames('flex align-c dark-ui')}>
			<PageTitle>Gofë - Search</PageTitle>

			<div className="results">
				{results.map(result => <TextResult key={result.URL} {...result} />)}
			</div>
		</div>
	);
};

const getServerSideProps = async (context: any) => {
	const query = context?.query?.q;

	if (!query || !Boolean(query)) return { props: { query: null } };

	return {
		props: {
			query,
		}
	}
}

SearchPage.layout = Layout;

export default SearchPage;

export {
	getServerSideProps,
}
