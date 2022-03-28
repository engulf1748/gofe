import axios from 'axios';

import { handleRequestError, wrapResponse } from './err';

import config from '../../config.json';

const getSuggestions = async (query: string) => {
	return axios.get(`${config.api_domain}/opensuggest?q=${query}`)
		.then(res => res.data)
		.catch(err => {
			return handleRequestError('getSuggestions', err);
		})
		.then(data => {
			return wrapResponse(data);
		});
}

export default {
	getSuggestions,
}
