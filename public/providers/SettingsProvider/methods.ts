const initialSettings = {
	theme: 'auto',
	openLinksInNewTab: false,
};

const _isEmpty = (v: any) => {
	return Object.keys(v).length === 0;
}

const _get = () => {
	let v;

	try {
		v = localStorage.getItem('settings');
	} catch (err) { v = null; }

	return v ? v : null;
}

const getSavedSettings = () => {
	let v = _get();

	if (v !== null && !_isEmpty(v)) {
		return JSON.parse(v);
	} else {
		return initialSettings;
	}
};

const saveSettings = (v: any) => {
	localStorage.setItem('settings', JSON.stringify(v));
};

export {
	getSavedSettings,
	saveSettings
}