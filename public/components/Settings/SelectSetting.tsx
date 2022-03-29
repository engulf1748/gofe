import { Select } from "@infinium/hydro";

import { useSettings } from "../../providers/SettingsProvider";


interface Props {
	id: string;
	label: string;
	options: string[];
}

const SelectSetting = ({ id, label, options }: Props) => {
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

	const getDefaultIndex = () => {
		if (settings[id]) {
			return options.indexOf(settings[id]);
		}

		return 0;
	}

	const onChange = (ev: any) => {
		settings.set(id, ev.id);
	}

	if (!settings) {
		return <></>;
	}

	return (
		<div className="w-100p flex-sb setting-block">
			<Select
				options={getOptions()}
				defaultSelected={getDefaultIndex()}
				onChange={onChange}
				color='gray'
				label={label}
			/>
		</div>
	);
}

export default SelectSetting;