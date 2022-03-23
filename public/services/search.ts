import axios from 'axios';

import { getSearchPageURL } from '../logic/query';

import config from '../data/config';

const getSearchResults = async (query: string) => {
	return axios.get(`${config.apiURL}${getSearchPageURL(query)}`)
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