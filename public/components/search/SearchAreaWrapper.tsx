import PageTitle from "../util/PageTitle";

interface Props {
	pageTitle: string;
	children: React.ReactNode;
}

const SearchAreaWrapper = ({ pageTitle, children }: Props) => {
	return (
		<div className={'flex align-c dark-ui'}>
		<PageTitle>Gofë - {pageTitle}</PageTitle>

			<div className="results">
				{children}
			</div>
		</div>
	);
};


export default SearchAreaWrapper;