import { useEffect, useState } from 'react';

import { useSettings } from '../../providers/SettingsProvider';

import { Checkbox } from '@infinium/hydro';

interface Props {
	id: string;
	label: string;
	options: [string, string];
}

const CheckboxSetting = ({ id, label, options }: Props) => {
	const settings = useSettings();
	const [checked, setChecked] = useState();

	const onChange = (v: any) => {
		setChecked(v);
	};

	useEffect(() => {
		settings.set(id, checked ? 'yes' : 'no');
	}, [checked]);

	return (
		<div>
			<div className='h-label-container'>
				<div className='h-label flex flex-row align-s justify-s'>
					<span>{label}</span>
				</div>
			</div>
			<Checkbox
				defaultChecked={settings.truthy(settings[id])}
				onChange={onChange}
				label={checked ? options[0] : options[1]}
			/>
		</div>
	);
};

export default CheckboxSetting;
