import ExternalLink from "../ExternalLink";

import type { Result } from "../../types/Search";


const TextResult = ({ href, description, context }: Result) => {
	return (
		<div className='text-result'>
			<div className="w-100p mw-35r">
				<ExternalLink href={href}>
					<div className="link-area">
						<p className="link">{href}</p>
						<h4 className='description'>{description}</h4>
					</div>
				</ExternalLink>
				<p className='context'>{context}</p>
			</div>
		</div>
	);
};


export default TextResult;