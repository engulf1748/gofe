import BaseNotice from "../components/BaseNotice";
import Notice from "../components/Notice";

interface Notice {
	id: string;
	PhantomNotice: any;

	// 'search' notices show up on the Search page
	type: 'search';
}

interface PhantomNoticeProps {
	dontShowAgain(): void;
}

const notices: Notice[] = [
	{
		id: 'can-customize',
		PhantomNotice: ({ dontShowAgain }: PhantomNoticeProps) => (
			<BaseNotice title='You can customize Gofë!'>
				<>
					<p className='fs-sm opacity-08 lh-1-6'>
						Gofë is equipped with a variety of themes and preferences.
						Tailor your experience via the settings button found in the
						top-right!
					</p>
					<button className="button sm" onClick={() => dontShowAgain()}>Thanks, got it</button>
				</>
			</BaseNotice>
		),
		type: 'search',
	},
];

// Every time a Notice is rendered, it checks localStorage for any
// item beginning with `gofe-notice-` and if the remaining string
// does not match any active notices, that value is removed.
const cleanupNotices = () => {
	const noticeIDs = notices.map(e => e.id);

	for (let key of Object.keys(localStorage)) {
		if (key.includes('gofe-notice')) {
			const id = key.replace('gofe-notice-', '');
			if (!noticeIDs.includes(id)) {
				try {
					localStorage.removeItem(`gofe-notice-${id}`);
				} catch {}
			}
		}
	}
}

export {
	notices,
	cleanupNotices,
}

export type {
	Notice,
}