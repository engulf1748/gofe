import classNames from 'classnames';

import Layout from '../components/layout/Layout';
import PageTitle from '../components/util/PageTitle';
import SearchBar from '../components/SearchBar';

import styles from '../styles/modules/Home.module.scss';

const Home = () => {
	return (
		<div className={classNames(styles.wrapper, 'flex align-c dark-ui')}>
			<PageTitle>Gofë - Home</PageTitle>

			<h1 className={styles.header}>Gofë Search</h1>
			<SearchBar />
		</div>
	);
};

Home.layout = Layout;

export default Home;
