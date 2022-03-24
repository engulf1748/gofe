import classNames from 'classnames';

import PageTitle from '../components/util/PageTitle';
import SearchBar from '../components/search/SearchBar';

import type { ChildrenOnly } from '../types/util';

import styles from '../styles/modules/Home.module.scss';
import Footer from '../components/shell/Footer';

const Home = () => {
	return (
		<div className={classNames(styles.wrapper, 'flex align-c dark-ui')}>
			<PageTitle>Gofë - Home</PageTitle>

			<h1 className={styles.header}>Gofë Search</h1>
			
			<div className="w-100p flex-c mw-25r px-2r">
				<SearchBar />
			</div>
		</div>
	);
};

// The <Navigation /> component is in the Layout
// component. Since we don't want the primary nav
// to show up on the home page, we'll mock the 
// Layout object here, on this one page.
Home.layout = ({ children }: ChildrenOnly) => (
	<div className='layout'>
		{children}
		<Footer />
	</div>
);

export default Home;
