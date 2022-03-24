import axios from 'axios';

import config from '../data/config';

const getSuggestions = async (query: string) => {
	return axios.get(`${config.apiURL}/opensuggest?q=${query}`)
		.then(res => res.data)
		.catch(err => {
			console.error(err);
		})
		.then(data => {
			if (!data) {
				console.error(`getSuggestions: 'data' needs to be defined. Got: ${data}`)
			}

			return data;
		});
}

export default {
	getSuggestions,
}
