import PageTitle from "../util/PageTitle";

interface Props {
	pageTitle: string;
	children: React.ReactNode;
}

const SearchAreaWrapper = ({ pageTitle, children }: Props) => {
	return (
		<div className={'flex align-c dark-ui mnh-screen'}>
			<PageTitle>Gofë - {pageTitle}</PageTitle>

			<div className="search-panel no-grid">
				{children}
			</div>
		</div>
	);
};


export default SearchAreaWrapper;