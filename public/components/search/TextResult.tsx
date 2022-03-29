import { useSettings } from "../../providers/SettingsProvider";

import ExternalLink from "../ExternalLink";

import type { Result } from "../../types/Search";


const TextResult = ({ URL, Desc, Context }: Result) => {
	const settings = useSettings();

	const shouldOpenNewTab = settings?.openLinksInNewTab === 'yes';

	return (
		<div className='text-result'>
			<div className="w-100p mw-35r">
				<ExternalLink href={URL} newTab={shouldOpenNewTab} className='text-link'>
					<div className="link-area">
						{/* TODO: Separate URL parts and display them better. */}
						<p className="url">{URL?.substring(0, 30)}...</p>
						<h4 className='description'>{Desc}</h4>
					</div>
				</ExternalLink>
				<p className='context'>{Context}</p>
			</div>
		</div>
	);
};


export default TextResult;