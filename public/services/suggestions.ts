import axios from 'axios';

import config from '../../config.json';
import { handleRequestError, wrapResponse } from './err';

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
