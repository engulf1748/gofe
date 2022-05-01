import { useLayoutEffect } from "react";

import { useSettings } from "../../providers/SettingsProvider";
import { themes } from "../../data/themes";

import type { ChildrenOnly } from "../../types/util";

const View = ({ children }: ChildrenOnly) => {
	const settings = useSettings();

	const onThemeChange = (ev: any) => {
		removeAllThemesFromBody();
		const mode = ev.matches ? 'dark' : 'light';
		document.body.classList.add(`modern-${mode}`);
	}

	const getAutoTheme = () => {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'modern-dark' : 'modern-light';
	}

	const removeAllThemesFromBody = () => {
		themes.forEach(theme => document.body.classList.remove(theme));
	}

	// The following block adds the current theme class
	// to the body when rendered. We use the useLayoutEffect
	// hook so that we can render and style new views as soon
	// as possible.
	useLayoutEffect(() => {
		if (!settings) return;

		const body = document.querySelector('body');

		if (!settings || !settings.theme) {
			settings.set('theme', 'modern-auto');
		}
		
		if (settings) {
			if (settings.theme === 'modern-auto') {
				window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onThemeChange);
				body?.classList.add(getAutoTheme());
			} else {
				body?.classList.add(settings.theme);
			}
		}
		
		return () => {
			removeAllThemesFromBody();
			window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', onThemeChange);
		}
	}, [settings]);

	return (
		<div className="view">
			{children}

			{settings.customTheme !== '' && settings.theme === 'custom' && (
				<link rel='stylesheet' type='text/css' href={settings.customTheme} />
			)}
		</div>
	);
};

export default View;