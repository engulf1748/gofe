import { useRouter } from "next/router";
import classNames from "classnames";

import { useQuery } from "../../providers/QueryProvider";
import { useSettings } from "../../providers/SettingsProvider";

interface Props {
	staticQuery: string;
	staticSuggestions: string[];
}

const RelatedSearches = ({ staticQuery, staticSuggestions }: Props) => {
	const { setQuery } = useQuery();
	const { push } = useRouter();
	const settings = useSettings();

	const onSuggestionClick = (suggestion: string) => {
		setQuery(suggestion);
		push(`/search?q=${suggestion}`);
	}

	if (!staticSuggestions || staticSuggestions.filter((suggestion: string) => suggestion !== staticQuery).length == 0) {
		return <></>;
	}

	return (
		(staticSuggestions.length === 0) ? <></> : (
			<div className="w-100p mt-3r">
				<h4>Related searches</h4>

				<div className={classNames('suggestion-pills', `view-${settings.suggestionsView || 'list'}`)}>
					{staticSuggestions
						.filter((suggestion: string) => suggestion !== staticQuery.trim())
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
		)
	);
}

export default RelatedSearches;
