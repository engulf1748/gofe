import PageTitle from "../../util/PageTitle";

interface Props {
	query: string;
}

const MAX_QUERY_LENGTH = 40;

const NoSearchResults = ({ query }: Props) => {
	const trimQuery = (query: string) => {
		if (query.length < MAX_QUERY_LENGTH) return query;
		return `${query.trim().substring(0, MAX_QUERY_LENGTH)}...`;
	}

	return (
		<div className="w-100p">
			<PageTitle>No results</PageTitle>

			<p><span className='s-query'>{trimQuery(query)}</span> did not yield any results.</p>
			<div>
				Suggestions:
				<ul>
					<li>Search for something more general.</li>
					<li>Try something tangential: you might get lucky.</li>
				</ul>
			</div>
		</div>
	);
}

export default NoSearchResults;