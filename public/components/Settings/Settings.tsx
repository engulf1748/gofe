import { useEffect, useState } from "react";
import classNames from "classnames";

import { useSettings } from "../../providers/SettingsProvider";

import InnerSettings from "./InnerSettings";

import { icons } from "../../data/icons";
import Keyboard from "../Keyboard";

const Settings = () => {
	const [modal, setModal] = useState(false);
	const settings = useSettings();

	const close = () => setModal(false);

	useEffect(() => {
		const b = document.body;

		if (modal) {
			b.addEventListener('click', close);
		}

		return () => b.removeEventListener('click', close);
	}, [modal]);

	return (
		<div>
			<button
				onClick={() => setModal(!modal)}
				className={classNames(
					'transparent-button',
					settings.preferIcons === 'yes' && 'icon-only',
					modal && 'open',
				)}
				title='Modify settings'
			>
				{settings.preferIcons === 'yes' ? (
					<>
						<i className="icon">{icons.cog}</i>
						<span className="sr-only">Modify settings</span>
					</>
				) : (
					<p className="mb-0">Settings</p>
				)}
			</button>

			<div
				className={classNames(
					'settings-panel',
					modal && 'open',
				)}
				onClick={(ev) => ev.stopPropagation()}
			>
				<InnerSettings />
			</div>

			<Keyboard
				keys={['esc']}
				callback={() => {
					if (modal) close();
				}}
				handleFocusableElements
			/>
		</div>
	);
};

export default Settings;
