import classNames from 'classnames';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';
import TextResult from '../components/search/TextResult';
import TextResultSkeleton from '../components/search/TextResultSkeleton';

import type { Result } from '../types/Search';

import { results as STATIC_RESULTS } from '../data/results.tmp';


interface Props {
	results: Result[];
}

const SearchPage = ({ results }: Props) => {
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

	return (
		<div className={classNames('flex align-c dark-ui')}>
			<PageTitle>Gofë - Search</PageTitle>

			<div className="results">
				{results.map(result => <TextResult key={result.href} {...result} />)}
			</div>
		</div>
	);
};

const getServerSideProps = (context: any) => {
	const query = context?.query?.q;

	if (!query || !Boolean(query)) return { props: { query: null } };

	// This is where we'll query the Go API and fetch
	// an array of results from the query. For now, it
	// returns static data.

	return {
		props: {
			results: STATIC_RESULTS,
		},
	};
}

SearchPage.layout = Layout;

export default SearchPage;

export {
	getServerSideProps,
}
