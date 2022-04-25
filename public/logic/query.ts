const parseQuery = (query: string) => {
	return encodeURIComponent(query);
}

const getPageQueryString = (page: number): string => {
	if (page === 1) return '';
	return `&p=${page}`;
}

// This works for both the Go API
// and the front-end, so it is re-used.
const getSearchPageURL = (query: string, page: number) => {
	return `/search?q=${parseQuery(query)}${getPageQueryString(page)}`;
}

const trim = (str: string, max: number = 30) => {
	return str.length > max ? `${str.substring(0, max)}...` : str;
}

const decodeURL = (_url: string) => {
	const { protocol, host, pathname } = new URL(_url);

	// The URL object doesn't have a method for splitting
	// the pathname, I guess.
	const paths = pathname.split('/');

	return {
		protocol,
		host,
		pathname,
		paths,
	};
}

export {
	getSearchPageURL,
	decodeURL,
	trim,
}