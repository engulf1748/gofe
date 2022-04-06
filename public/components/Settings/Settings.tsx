import { useState } from "react";
import { Button } from "@infinium/hydro";

import SettingsModal from "./SettingsModal";

import { icons } from "../../data/icons";


const Settings = () => {
	const [modal, setModal] = useState(false);

	return (
		<>
			<Button
				variant='icon'
				size='sm'
				color='transparent'
				onClick={() => setModal(!modal)}
				mods='settings-button'
				title='Modify your preferences'
			>
				<span className="sr-only">Modify your preferences</span>
				<i className="j-icon">{icons.cog}</i>
				<span className="sr-only">Click to open settings</span>
			</Button>

			<SettingsModal
				modal={modal}
				setModal={setModal}
			/>
		</>
	);
};

export default Settings;
