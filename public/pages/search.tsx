import classNames from 'classnames';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';
import TextResult from '../components/search/TextResult';

import type { Result } from '../types/Search';

import { results as STATIC_RESULTS } from '../data/results.tmp';


interface Props {
	results: Result[];
}

const SearchPage = ({ results }: Props) => {
	console.log({results});

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
	// We'll need to do better checks against
	// the query here.
	const query = context?.query?.q;

	if (!query || !Boolean(query)) return { props: { query: undefined } };

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
