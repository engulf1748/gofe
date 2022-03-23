import axios from 'axios';
import config from '../data/config';

const getSearchResults = async (query: string) => {
	return axios.get(`${config.apiURL}/search?q=${query}`)
		.then(res => res.data)
		.catch(err => {
			console.error(err);
		})
		.then(data => {
			console.log({data})

			if (!data) {
				console.error(`getSearchResults: 'data' needs to be defined. Got: ${data}`)
			}

			return data;
		});
}

export default {
	getSearchResults,
}