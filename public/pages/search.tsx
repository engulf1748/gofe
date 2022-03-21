import classNames from 'classnames';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';

import styles from '../styles/modules/Home.module.scss';


interface Props {
	query: string | undefined;
}

const SearchPage = ({ query }: Props) => {
	console.log({query});

	return (
		<div className={classNames(styles.wrapper, 'flex align-c dark-ui')}>
			<PageTitle>Gofë - Search</PageTitle>

			<h1 className={styles.header}>Search results will go here</h1>
		</div>
	);
};

const getServerSideProps = (context: any) => {
	// We'll need to do better checks against
	// the query here.
	const query = context?.query?.q;

	if (!query || !Boolean(query)) return { props: { query: undefined } };

	return {
		props: {
			query,
		},
	};
}

SearchPage.layout = Layout;

export default SearchPage;

export {
	getServerSideProps,
}
