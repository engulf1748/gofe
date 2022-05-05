// A component that is given a specific ID and tracks its
// visibility via localStorage
//
// In other words, a component that users can choose to
// never show again.
//
// To prevent potential performance/rendering issues,
// this, by default, renders nothing—only rendering
// something if it is absolutely sure the user hasn't
// hidden this before.
//
// It _does not_ utilize the existing useSettings API
// because it would be unmaintainable not only to
// pollute the existing structure but also to be
// consistently updating it. Not to mention the 
// restrictive and error-hardened nature of the
// Settings API anyway.

import { useEffect, useState } from "react";

import { cleanupNotices, Notice as TNotice } from "../data/notices";
import ls from '../logic/storage';

interface Props extends TNotice {

}

const Notice = ({ id, PhantomNotice }: Props) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const v = localStorage.getItem(`gofe-notice-${id}`);
		if (v === "true" || !v) {
			setVisible(true);
			ls.set(`gofe-notice-${id}`, 'true');
		}

		// Perform a normal cleanup
		cleanupNotices();
	}, [id]);

	const dontShowAgain = () => {
		ls.set(`gofe-notice-${id}`, 'false');
		setVisible(false);
	}

	if (!visible) return <></>;

	return <PhantomNotice dontShowAgain={dontShowAgain} />;
}

export default Notice;