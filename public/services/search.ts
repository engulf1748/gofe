import axios from 'axios';

import { getSearchPageURL } from '../logic/query';

import config from '../data/config';

const getSearchResults = async (query: string, page: number) => {
	// We want the URL to display "friendly" page numbers
	// starting with 1, so we'll just adjust the page value
	// on API requests.
	return axios.get(`${config.apiURL}${getSearchPageURL(query, page - 1)}`)
		.then(res => res.data)
		.catch(err => {
			console.error(err);
		})
		.then(data => {
			if (!data) {
				console.error(`getSearchResults: 'data' needs to be defined. Got: ${data}`)
			}

			return data;
		});
}

export default {
	getSearchResults,
}