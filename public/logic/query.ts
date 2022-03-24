// Returns the query but with spaces replaced
// with the plus sign.
// TODO:
// Does this make a big difference?
const parseQuery = (query: string) => {
	return query.split(' ').join('+');
}

const getPageQueryString = (page: string | null): string => {
	if (!page) return '';
	return `&p=${page}`;
}

// This works for both the Go API
// and the front-end, so it is re-used.
const getSearchPageURL = (query: string, page: string | null = null) => {
	return `/search?q=${parseQuery(query)}${getPageQueryString(page)}`;
}

export {
	getSearchPageURL,
}