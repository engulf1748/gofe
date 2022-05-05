import { toast } from "@infinium/hydro";

const set = (k: string, v: any) => {
	try {
		localStorage.setItem(k, v);
	} catch {
		toast.error('Unable to set preferences. Are your cookies disabled?');
	}
}

const get = (k: string) => {
	try {
		localStorage.getItem(k);
	} catch {}
}

export default {
	set,
	get,
}