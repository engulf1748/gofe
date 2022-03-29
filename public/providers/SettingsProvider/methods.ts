import { defaultSettings } from "./settings";

const _isEmpty = (v: any) => {
	return Object.keys(v).length === 0;
}

// We have to go this back-handed route to use
// localStorage for a few reasons. Primarily,
// we are using NextJS and therefore we have
// to work with the client-side limitations of
// the initial SSR. This causes things like
// `window` and `localStorage` to be undefined.
// Thus, we have this try-catch block that will
// default to returning `null`.
const _get = () => {
	let v;

	try {
		v = localStorage.getItem('settings');
	} catch (err) { v = null; }

	return v ? v : null;
}

// If the above function returns `null` or the
// settings are empty, this will return the
// `defaultSettings`. If not, this will parse
// the settings object and return it.
const getSavedSettings = () => {
	let v = _get();

	if (v !== null && !_isEmpty(v)) {
		return JSON.parse(v);
	} else {
		return defaultSettings;
	}
};

const saveSettings = (v: any) => {
	try {
		localStorage.setItem('settings', JSON.stringify(v));
	} catch (err) {
		// This usually happens when storage is disabled on the
		// user's browser. It happens to me when I enable "Block
		// all cookies" in the Safari preferences.
		console.error(err);
	}
};

export {
	getSavedSettings,
	saveSettings,
}