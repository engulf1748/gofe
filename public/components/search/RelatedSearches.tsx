import { useRouter } from "next/router";
import classNames from "classnames";

import { useSearch } from "../../providers/SearchProvider";
import { useSettings } from "../../providers/SettingsProvider";

interface Props {
	staticQuery: string;
	suggestions: string[];
}

const RelatedSearches = ({ staticQuery, suggestions }: Props) => {
	const { setQuery } = useSearch();
	const { push } = useRouter();
	const settings = useSettings();

	const onSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		push(`/search?q=${suggestion}`);
	}

	if (!suggestions || suggestions.length === 0) {
		return <></>;
	}

	return (
		<div className="w-100p mt-3r">
			<h4>Related searches</h4>

			<div className={classNames('suggestion-pills', `view-${settings.suggestionsView || 'list'}`)}>
				{suggestions
					.filter(e => e !== staticQuery)
					.map((suggestion: string) => {
					return (
						<div key={suggestion}>
							<button className="suggestion-pill" onClick={() => onSuggestionClick(suggestion)}>
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
