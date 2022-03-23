// Returns the query but with spaces replaced
// with the plus sign.
// TODO:
// Does this make a big difference?
const parseQuery = (query: string) => {
	return query.split(' ').join('+');
}

// This works for both the Go API
// and the front-end, so it is re-used.
const getSearchPageURL = (query: string) => {
	// TODO:
	// Add page number support here.
	return `/search?q=${parseQuery(query)}`;
}

export {
	getSearchPageURL,
}