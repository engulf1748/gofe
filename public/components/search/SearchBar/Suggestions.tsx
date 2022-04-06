import { useEffect, useState } from "react";
import classNames from "classnames";

import { useQuery } from "../../../providers/QueryProvider";
import { useSettings } from "../../../providers/SettingsProvider";

import Suggestion from "./Suggestion";

import { icons } from "../../../data/icons";
import Keyboard from "../../Keyboard";


interface Props {
	close(): void;
}

const Suggestions = ({ close }: Props) => {
	const { query, suggestions } = useQuery();
	const settings = useSettings();

	const [selected, setSelected] = useState(-1);
	
	const setView = (v: 'view-list' | 'view-grid') => {
		settings.set('suggestionsView', v);
	}

	if (!suggestions) {
		return <></>;
	}

	return (
		<div className='sb-suggestions'>
			
			{suggestions.length > 0 && (
				<div className={classNames(
					'sb-suggestions-view',
					settings.suggestionsView || 'view-list',
				)}>
					{suggestions
						.filter((s: string) => s !== query)
						.map((suggestion: string, index: number) => (
							<Suggestion
								key={suggestion}
								suggestion={suggestion}
								selected={selected === index}
								close={close}
							/>
						)
					)}
				</div>	
			)}

			<div
				className={classNames('sb-suggestion-meta', suggestions.length === 0 && 'no-suggestions')}
				onClick={(ev: any) => {
					ev.stopPropagation();
				}}
			>
				{suggestions.length === 0 ? (
					<p>No suggestions</p>
				) : (
					<p>{suggestions.length} suggestion{suggestions.length > 1 && 's'}</p>
				)}

				<div className='buttons'>
					<button onClick={() => setView('view-grid')} title='View as bubbles'>
						<i className="j-icon xs">{icons.viewGrid}</i>
					</button>
					<button onClick={() => setView('view-list')} title='View as list'>
						<i className="j-icon xs">{icons.viewList}</i>
					</button>
				</div>
			</div>

			<Keyboard
				keys={['esc', 'up', 'down', 'left', 'right']}
				callback={(key: string, ev: any) => {
					if (key === 'esc') {
						close();
						return;
					}

					// Prevent scrolling when this is open.
					ev.preventDefault();

					const relativeIndex = suggestions.length - 2;
					const isUp = (key === 'up' || key === 'left');

					if (isUp) {
						// If going UP and:
						// 	- Selected is FIRST item, return last item
						//	- Selected is not FIRST item, return selected - 1
						setSelected(s => selected === 0 ? relativeIndex : s - 1);
					} else {
						// If going DOWN and:
						// 	- Selected is LAST item, return FIRST item
						//	- Selected is not LAST item, return selected + 1
						setSelected(s => selected === relativeIndex ? 0 : s + 1);
					}
				}}
				handleFocusableElements
			/>

		</div>
	);
};

export default Suggestions;