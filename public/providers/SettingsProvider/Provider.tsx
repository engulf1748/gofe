import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react';

import { usePrevious } from '../../hooks/usePrevious';

import { getSavedSettings, saveSettings } from './methods';
import { defaultSettings, settingsSchema } from './settings';

import type { ChildrenOnly } from '../../types/util';


const SettingsContext = createContext<any>({});

const SettingsProvider = ({ children }: ChildrenOnly) => {
	const [settings, setSettings] = useState(
		() => {
			// This merges the initial settings with the
			// user's saved settings. This will mean that
			// any value added to defaultSettings will be
			// stored automatically.
			return {
				...defaultSettings,
				...getSavedSettings(),
			};
		}
	);

	const set = useCallback((key: string, value: any) => {
		setSettings({ ...settings, [key]: value });
	}, [settings, setSettings]);

	const deleteSetting = useCallback((key: string) => {
		// Don't mutate directly!
		let s = { ...settings };
		delete s[key];
		setSettings(s);
	}, [settings, setSettings]);

	const previousSettings = usePrevious(settings);

	const truthy = (v: string) => {
		return v === 'yes' || v === 'Yes' || v === 'true';
	}

	useEffect(() => {
		const keys = Object.keys(settings);
		keys.forEach(key => {
			const currentValue = settings[key];
			const allowedValues = settingsSchema[key]?.allowedValues;

			// If there are no allowedValues, this setting is not
			// an "official" one; therefore, we get rid of it.
			if (!allowedValues) {
				deleteSetting(key);
				return;
			}

			// If the saved value of this key is not in the specified
			// values, set it to the default.
			if (!allowedValues.includes(currentValue)) {
				set(key, defaultSettings[key]);
			}

			// If the setting is "official" and it's value is valid,
			// leave it alone.
		});
	}, []);

	useEffect(() => {
		if (JSON.stringify(settings) !== JSON.stringify(previousSettings)) {
			saveSettings(settings);
		}
	}, [settings]);

	const value = {
		...settings,
		set,
		truthy,
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