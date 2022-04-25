import SearchAreaWrapper from "../SearchAreaWrapper";
import TextResultSkeleton from "../TextResultSkeleton";

const ResultsLoading = () => {
	return (
		<SearchAreaWrapper pageTitle='Fetching results...'>
			<div className="h-1r"></div>
			{[1, 2, 3, 4, 5, 6, 7].map(e => (
				<TextResultSkeleton key={e} />
			))}
		</SearchAreaWrapper>
	);
};


export default ResultsLoading;