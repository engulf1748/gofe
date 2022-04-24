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

export {
	getSearchPageURL,
}