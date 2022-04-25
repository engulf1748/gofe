import { useState } from "react";
import { Button } from "@infinium/hydro";

import SettingsModal from "./SettingsModal";

import { icons } from "../../data/icons";


const Settings = () => {
	const [modal, setModal] = useState(false);

	return (
		<>
			<button
				onClick={() => setModal(!modal)}
				className='settings-button'
				title='Modify settings'
			>
				<p className="mb-0 mr-0-5r">Settings</p>
				<i className="j-icon">{icons.cog}</i>
			</button>

			<SettingsModal
				modal={modal}
				setModal={setModal}
			/>
		</>
	);
};

export default Settings;
