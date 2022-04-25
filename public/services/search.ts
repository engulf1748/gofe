import axios from 'axios';

import config from '../../config.json';
import { getSearchPageURL } from '../logic/query';
import { handleRequestError, wrapResponse } from './err';

const getSearchResults = async (query: string, page: number) => {
	return axios.get(`${config.api_domain}${getSearchPageURL(query, page)}`)
		.then(res => res.data)
		.catch(err => {
			return handleRequestError('getSearchResults', err);
		})
		.then(data => {
			return wrapResponse(data);
		});
}

export default {
	getSearchResults,
}
