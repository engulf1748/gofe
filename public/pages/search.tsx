import { useEffect, useState } from 'react';
import classNames from 'classnames';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';
import TextResult from '../components/search/TextResult';
import TextResultSkeleton from '../components/search/TextResultSkeleton';

import searchAPI from '../services/search';

import type { Result } from '../types/Search';


interface Props {
	query: string;
}

const SearchPage = ({ query }: Props) => {
	const [results, setResults] = useState<Result[] | undefined>(undefined);

	useEffect(() => {
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
	}, [query]);

	if (!results) {
		return (
			<div className={classNames('flex align-c dark-ui')}>
				<PageTitle>Gofë - Fetching results...</PageTitle>

				<div className="results">
					{[1, 2, 3, 4, 5, 6].map(e => (
						<TextResultSkeleton key={e} />
					))}
				</div>
			</div>
		);
	}

	// TODO: Add SoySS classes
	if (results.length === 0) {
		return (
			<div>
				<span>{query}</span> did not yield any results.
				<div>
					Suggestions:
					<ul>
						<li>Search for something more general.</li>
						<li>Try something tangential: you might get lucky.</li>
					</ul>
				</div>
			</div>
		)
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
