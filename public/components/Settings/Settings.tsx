import { useState } from "react";

import { useSettings } from "../../providers/SettingsProvider";

import SettingsModal from "./SettingsModal";

import { icons } from "../../data/icons";
import classNames from "classnames";

const Settings = () => {
	const [modal, setModal] = useState(false);
	const settings = useSettings();

	return (
		<>
			<a
				onClick={() => setModal(!modal)}
				className={classNames('settings-button', settings.preferIcons === 'yes' && 'icon-only')}
				title='Modify settings'
			>
				{settings.preferIcons === 'yes' ? (
					<>
						<i className="j-icon">{icons.cog}</i>
						<span className="sr-only">Modify settings</span>
					</>
				) : (
					<p className="mb-0">Settings</p>
				)}
			</a>

			<SettingsModal
				modal={modal}
				setModal={setModal}
			/>
		</>
	);
};

export default Settings;
