import SearchAreaWrapper from "../SearchAreaWrapper";
import TextResultSkeleton from "../TextResultSkeleton";


const ResultsLoading = () => {
	return (
		<SearchAreaWrapper pageTitle='Fetching results...'>
			{[1, 2, 3, 4, 5, 6, 7].map(e => (
				<TextResultSkeleton key={e} />
			))}
		</SearchAreaWrapper>
	);
};


export default ResultsLoading;