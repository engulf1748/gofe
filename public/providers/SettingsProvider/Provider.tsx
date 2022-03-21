import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react';

import { getSavedSettings, saveSettings } from './methods';

import type { ChildrenOnly } from '../../types/util';


const SettingsContext = createContext<any>({});

const SettingsProvider = ({ children }: ChildrenOnly) => {
	const [settings, setSettings] = useState(
		() => {
			return getSavedSettings();
		}
	);

	useEffect(() => {
		saveSettings(settings);
	}, [settings]);

	const value = {
		...settings,
		set: useCallback((key: string, value: any) => 
			setSettings({ ...settings, [key]: value }), 
			[settings, setSettings]
		),
	};

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	);
}

const useSettings = () => {
	return useContext(SettingsContext);
}

export default SettingsProvider;

export {
	useSettings,
}