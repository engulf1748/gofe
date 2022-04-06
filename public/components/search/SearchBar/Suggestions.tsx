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
	const { suggestions } = useQuery();
	const settings = useSettings();

	const [selected, setSelected] = useState(0);
	
	const setView = (v: 'view-list' | 'view-grid') => {
		settings.set('suggestionsView', v);
	}

	useEffect(() => {
		console.log(selected)
	}, [selected])

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
					{suggestions.map((suggestion: string, index: number) => (
						<Suggestion
							key={suggestion}
							suggestion={suggestion}
							selected={selected + 1 === index}
							close={close}
						/>
					))}
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

					if (key === 'up' || key === 'left') {
						setSelected(s => selected === 0 ? relativeIndex : s - 1);
					} else {
						setSelected(s => selected === relativeIndex ? 0 : s + 1);
					}
				}}
				handleFocusableElements
			/>

		</div>
	);
};

export default Suggestions;