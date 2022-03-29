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
			>
				<i className="j-icon">{icons.cog}</i>
			</Button>

			<SettingsModal
				modal={modal}
				setModal={setModal}
			/>
		</>
	);
};

export default Settings;