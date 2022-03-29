import { useRouter } from "next/router";

import { useQuery } from "../../providers/QueryProvider";


const RelatedSearches = () => {
	const { query, setQuery, suggestions } = useQuery();
	const { push } = useRouter();

	const onSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		push(`/search?q=${suggestion}`);
	}

	if (!suggestions) {
		return <></>;
	}

	return (
		(suggestions.length === 0) ? <></> : (
			<div className="w-100p mt-3r">
				<h4>Related searches</h4>

				<div className="suggestion-pills">
					{suggestions
						.filter((suggestion: string) => suggestion !== query)
						.map((suggestion: string) => {
						return (
							<div>
								<button className="suggestion-pill" onClick={() => onSuggestionClick(suggestion)}>
									<span>{suggestion}</span>
								</button>
							</div>
						);
					})}
				</div>
			</div>
		)
	);
}

export default RelatedSearches;
