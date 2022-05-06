import BaseNotice from "../components/BaseNotice";
import ExternalLink from "../components/ExternalLink";
import Notice from "../components/Notice";
import { icons } from "./icons";

interface Notice {
	id: string;
	PhantomNotice: any;

	// 'search' notices show up on the Search page
	type: 'search' | 'home';
}

interface PhantomNoticeProps {
	dontShowAgain(): void;
}

const notices: Notice[] = [
	{
		id: 'can-customize',
		type: 'search',
		PhantomNotice: ({ dontShowAgain }: PhantomNoticeProps) => (
			<BaseNotice title='You can customize Gofë!'>
				<>
					<p className='fs-sm opacity-08 lh-1-6'>
						Gofë is equipped with a variety of themes and
						preferences. Tailor your experience via the settings
						button found in the top-right!
					</p>
					<button
						className='button sm'
						onClick={() => dontShowAgain()}
					>
						Thanks, got it
					</button>
				</>
			</BaseNotice>
		),
	},
	{
		id: 'is-in-alpha',
		type: 'home',
		PhantomNotice: ({ dontShowAgain }: PhantomNoticeProps) => (
			<div className='mw-30r bg radius-8 pl-1r pr-0-5r py-0-5r flex-r inline-notice'>
				<p className='fs-sm mb-0'>
					Gofë is currently in alpha. If you notice any bugs,{' '}
					<ExternalLink href='https://codeberg.org/ar324/gofe/issues' className='obvious-link'>
						let us know!
					</ExternalLink>
				</p>
				<button
					className='transparent-button complete ml-0-5r'
					onClick={() => dontShowAgain()}
					title="Close and don't show again"
				>
					<span className="sr-only">Don't show again</span>
					<i className='icon'>{icons.x}</i>
				</button>
			</div>
		),
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