import { useLayoutEffect } from "react";

import { useSettings } from "../../providers/SettingsProvider";

import type { ChildrenOnly } from "../../types/util";

const View = ({ children }: ChildrenOnly) => {
	const settings = useSettings();


	// The following block adds the current theme class
	// to the body when rendered. We use the useLayoutEffect
	// hook so that we can render and style new views as soon
	// as possible.
	useLayoutEffect(() => {
		if (!settings) return;

		const body = document.querySelector('body');
		const theme = settings.theme || 'modern';
		
		if (settings) {
			body?.classList.add(theme);
		}
		
		return () => {
			body?.classList.remove(theme);
		}
	}, [settings]);

	return (
		<div className="view">
			{children}
		</div>
	);
};

export default View;