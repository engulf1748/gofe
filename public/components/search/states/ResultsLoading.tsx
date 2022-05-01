import PageTitle from "../../util/PageTitle";
import TextResultSkeleton from "../TextResultSkeleton";

const ResultsLoading = () => {
	return (
		<>
			<PageTitle>Fetching results...</PageTitle>
			<div className="h-1r"></div>
			{[1, 2, 3, 4, 5, 6, 7].map(e => (
				<TextResultSkeleton key={e} />
			))}
		</>
	);
};


export default ResultsLoading;