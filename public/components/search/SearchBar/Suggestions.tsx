import { MutableRefObject, useEffect, useState } from "react";
import classNames from "classnames";

import { useSearch } from "../../../providers/SearchProvider";
import { useSettings } from "../../../providers/SettingsProvider";

import Suggestion from "./Suggestion";
import Keyboard from "../../Keyboard";
import MiniButton from "../../MiniButton";


interface Props {
	inputRef: MutableRefObject<HTMLInputElement | undefined>;
	close(): void;
}

const Suggestions = ({ inputRef, close }: Props) => {
	const { query, previousQuery, suggestions } = useSearch();
	const settings = useSettings();

	const [selected, setSelected] = useState(-1);
	const [emptyMessage, setEmptyMessage] = useState('Type to get suggestions');

	useEffect(() => {
		if (suggestions.length === 0 && query !== previousQuery) {
			setEmptyMessage('No suggestions');
		}
	}, [suggestions, query])
	
	const setView = (v: 'list' | 'grid') => {
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
					`view-${settings.suggestionsView || 'list'}`,
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
					<p>{emptyMessage}</p>
				) : (
					<p>{suggestions.length} suggestion{suggestions.length > 1 && 's'}</p>
				)}

				<div className='buttons'>
					<MiniButton
						onClick={() => setView('grid')}
						title='View as bubbles'
						icon='viewGrid'
						active={settings.suggestionsView === 'grid'}
					/>
					<MiniButton
						onClick={() => setView('list')}
						title='View as list'
						icon='viewList'
						active={settings.suggestionsView === 'list'}
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

					// Blur the input to disable the <input>s
					// Keyboard events
					inputRef.current?.blur();

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