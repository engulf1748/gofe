import { toast } from "@infinium/hydro";

const resetLocalStorage = (clearSettings = false) => {
	// This function does not return an indicator
	// if it actually works. Since Safari on iOS
	// gave me problems, I'm wrapping it in a try-
	// catch just in case.
	try {
		clearSettings ? localStorage.setItem('settings', '{}') : localStorage.clear();
	} catch {}
	
	if (window && window.location) {
		window.location.reload();
	} else {
		toast.error('Unable to reload automatically.');
	}
}

export {
	resetLocalStorage,
}