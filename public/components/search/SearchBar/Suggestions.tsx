import { useEffect, useState } from "react";
import classNames from "classnames";

import { useQuery } from "../../../providers/QueryProvider";
import { useSettings } from "../../../providers/SettingsProvider";

import Suggestion from "./Suggestion";

import { icons } from "../../../data/icons";
import Keyboard from "../../Keyboard";
import MiniButton from "../../MiniButton";


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
					<MiniButton
						onClick={() => setView('view-grid')}
						title='View as bubbles'
						icon='viewGrid'
						active={settings.suggestionsView === 'view-grid'}
					/>
					<MiniButton
						onClick={() => setView('view-list')}
						title='View as list'
						icon='viewList'
						active={settings.suggestionsView === 'view-list'}
					/>
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