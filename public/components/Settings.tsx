import { useState } from "react";
import { Button, Modal, Select } from "@infinium/hydro";

import Keyboard from "./Keyboard";

import { useSettings } from "../providers/SettingsProvider";
import { themes } from "../data/themes";
import { icons } from "../data/icons";


interface SettingRowProps {
	id: string;
	options: string[];
}

const SettingRow = ({ id, options }: SettingRowProps) => {
	const settings = useSettings();

	const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

	const getOptions = () => {
		return options.map(e => {
			let label = cap(e);

			if (e.includes('-')) {
				label = e.split('-').map(w => cap(w)).join(' ');
			}

			return {
				id: e, label
			}
		})
	}

	const onChange = (ev: any) => {
		settings.set(id, ev.id);
	}

	if (!settings) {
		return <></>;
	}

	return (
		<div className="w-100p flex-sb setting-row">
			<span className="label">{id}</span>
			<Select
				options={getOptions()}
				defaultSelected={options.indexOf(settings[id])}
				onChange={onChange}
				color='gray'
			/>
		</div>
	);
}

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

			<Modal
				state={modal}
				setState={setModal}
				size='sm'
				modal={{
					title: 'Settings',
					// content: 'Hi',
					okayButtonText: 'Done',
				}}
				background='medium'
			>
				<div className='w-100p mb-2r mt-1r'>
					<div className="w-100p flex-sb">
						<SettingRow id='theme' options={themes} />
					</div>
				</div>
			</Modal>

			<Keyboard
				keys={['s']}
				callback={() => {
					setModal(!modal);
				}}
			/>
		</>
	);
};

export default Settings;