import { isMobile } from "react-device-detect";

import { useSettings } from "../../providers/SettingsProvider";

import ExternalLink from "../ExternalLink";

import { decodeURL, trim } from "../../logic/query";
import { icons } from "../../data/icons";

import type { Result } from "../../types/Search";
import type { ChildrenOnly } from "../../types/util";


interface URLObject {
	host: string;
	paths: string[];
	index: number;
}

// The max trim length of the hostname in the URL.
const HOST_MAX_LENGTH = 25;

// The default length used for paths within the URL.
const DEFAULT_MAX_LENGTH = 25;

// The trim length of any given path if the previous
// path has a greater length than DEFAULT_MAX_LENGTH.
// If the path is the first item, this will be used if
// the length of the host is greater than HOST_MAX_LENGTH
const MINIMIZED_LENGTH = isMobile ? 5 : 8;

// The total number of characters within the URL string
// that should be tolerated. Loosely enforced right now.
const ABSOLUTE_MAX = isMobile ? 50 : 65;

// If none of the conditions are handled and it's the
// last item, use this length.
const LAST_ITEM_EDGE_CASE_LENGTH = 14;

// This determines the length a part of a pathname
// should be based on the length of the previous item.
// Basically, given a URL object with a host having a 
// length of HOST_MAX_LENGTH and multiple paths each of
// length DEFAULT_MAX_LENGTH, this will cause only the
// first path (i.e. the first thing _after_ the host)
// to display at the DEFAULT_MAX_LENGTH.
//
// If the previous item is greater than DEFAULT_MAX_LENGTH,
// this will return MINIMIZED_LENGTH, which is arbitrary.
// `5` works just as well but saves more space; `8` obviously
// provides more information.
//
// To counteract some of the potential confusion, I set the
// title="" attribute of the primary TextResult link
// to the full URL. Therefore, screenreaders or anyone who
// holds their mouse over it will be able to see the full thing.
//
// We could obviously add more conditions here to really play 
// with the return value, but for now this is suitable. I was
// shooting for something that would work for the edge-cases
// with super long URLs. This works fine for that.
const determinePathTrimLength = ({ host, paths, index }: URLObject, totalLength: number | null): number => {
	const numItems = paths.length + 1; // +1 for host
	const lengths = paths.map(path => path.length);
	const previousItem = index === 0 ? host.length : lengths[index - 1];
	const isLastItem = index === paths.length - 1;

	if (totalLength && totalLength > ABSOLUTE_MAX) {
		return MINIMIZED_LENGTH;
	}

	// If there's only one path, allow it to be the
	// full length minus the length of the host.
	if (numItems === 2) {
		return ABSOLUTE_MAX - host.length;
	}

	// If there are two paths, allow each one to be
	// half ABSOLUTE_MAX minus the host length
	if (numItems === 3) {
		return (ABSOLUTE_MAX - host.length) / 2;
	}

	if (previousItem > DEFAULT_MAX_LENGTH) {
		return MINIMIZED_LENGTH;
	}

	// If none of the above and last item, make it shorter.
	if (isLastItem) {
		return LAST_ITEM_EDGE_CASE_LENGTH;
	}

	return DEFAULT_MAX_LENGTH;
}

// I love this trick.
// Since I don't want to create a wrapper element within the
// DOM just to add a key={} value, we create an identity for
// a component that allows React to track it.
//
// I don't know how much of a difference it makes to declare
// this var at the module-level as opposed to the component-
// level, but I assume it improves rendering performance 
// (albeit unnoticeably) as it won't have to be re-created
// for every result.
const KeyGiver = ({ children }: ChildrenOnly) => <>{children}</>;

const TextResult = ({ URL, Desc, Context }: Result) => {
	const settings = useSettings();

	const shouldOpenNewTab = settings?.openLinksInNewTab === 'yes';

	const getInnerURLMarkup = () => {
		const { protocol, host, paths: _paths } = decodeURL(URL);

		// I didn't observe a path ever being a single /, but
		// I added that condition just in case. I did, however,
		// notice some of them being empty, both before and after.
		//
		// I don't necessarily love slicing the array here, but we
		// can't display more than a few paths. We might want to
		// find a way to display a combination of the first and
		// last items, but I'll wait on this logic until we've used
		// this for some time.
		const paths = _paths.filter(e => e !== '' && e !== '/').slice(0, 3);
		const totalLength = paths.reduce((p, c, i) => determinePathTrimLength({
			host,
			paths,
			index: i
		}, null) + p, 0);

		return (
			<>
				<span>{protocol}{'//'}{trim(host, HOST_MAX_LENGTH)}</span>
				{paths.length > 0 && paths.map((path, index) => (
					// Certain paths can be the same, but probably
					// not with the index value, haha.
					<KeyGiver key={`${path}${index}`}>
						<i className="icon sm opacity-6 mx-0-125r">{icons.chevronRight}</i>
						<span>{trim(path, determinePathTrimLength({
							host,
							paths,
							index,
						}, totalLength))}</span>
					</KeyGiver>
				))}
			</>
		);
	}

	return (
		<div className='text-result'>
			<div className="w-100p mw-35r flex">
				<ExternalLink href={URL} newTab={shouldOpenNewTab} className='text-link' title={URL}>
					<div className="link-area">
						<div className="url flex align-c justify-s flex-row">{getInnerURLMarkup()}</div>
						<h4 className='description'>{Desc}</h4>
					</div>
				</ExternalLink>
				<p className='context'>{Context}</p>
			</div>
		</div>
	);
};


export default TextResult;