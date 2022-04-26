import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

import { useSearch } from "../../providers/SearchProvider";
import { useSettings } from "../../providers/SettingsProvider";

interface Props {
	staticQuery: string;
}

const RelatedSearches = ({ staticQuery }: Props) => {
	const { getSuggestions, setQuery } = useSearch();
	const [staticSuggestions, setStaticSuggestions] = useState<string[] | undefined>(undefined);
	const { push } = useRouter();
	const settings = useSettings();

	useEffect(() => {
		if (staticSuggestions === undefined) {
			getSuggestions(staticQuery)
				.then((data: any) => {
					if (data.type === 'success' && data.data.length === 2) {
						setStaticSuggestions(data.data[1]);
					} else {
						setStaticSuggestions([]);
					}
				});
		}
	}, [staticSuggestions]);

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
