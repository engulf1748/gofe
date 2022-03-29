import { useRouter } from "next/router";
import { useQuery } from "../../providers/QueryProvider"

const RelatedSearches = () => {
	const { query, setQuery, suggestions } = useQuery();
	const { push } = useRouter();

	const onSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		push(`/search?q=${suggestion}`);
	}

	if (!suggestions || suggestions.length === 0) return <></>;

	return (
		<div className="w-100p">
			<h4>Related searches</h4>
			<div className="suggestion-pills">
				{suggestions.map((suggestion: string) => {
					// It's not a _related_ query if it's the same
					// query.
					if (query === suggestion) return <></>;

					return (
						<div>
							<button key={suggestion} className="suggestion-pill" onClick={() => onSuggestionClick(suggestion)}>
								<span>{suggestion}</span>
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default RelatedSearches;