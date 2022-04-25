import type { AxiosError, AxiosResponse } from "axios";
import type { APIResponse } from "../types/util";

type APIError = 'BadResponse' | 'NoResponse' | 'BadRequest';

interface Response {
	errorType: APIError;
	[key: string]: any;
}

// The request was made and the server responded with a status code
// that falls out of the range of 2xx
const handleBadResponseError = (e: (m: string) => string, res: AxiosResponse): Response => {
	console.error(e('Request fulfilled but response not 2xx. Response data:'));

	const response = {
		errorType: 'BadResponse',
		data: res.data,
		status: res.status,
		headers: res.headers,
	}

	console.log({ response });
	
	// This is fine.
	// @ts-ignore
	return response;
}

// The request was made but no response was received
const handleNoResponseError = (e: (m: string) => string): Response => {
	console.error(e('Request good; server not responding.'));

	return {
		errorType: 'NoResponse',
	}
}

// Something happened in setting up the request that triggered an Error
const handleUnknownRequestError = (e: (m: string) => string): Response => {
	console.error(e('Bad request. Unknown error.'));

	return {
		errorType: 'BadRequest',
	}
}

const handleRequestError = (id: string, err: AxiosError): Response => {
	const e = (msg: string) => `handleRequestError (${id}): ${msg}`;

	if (err.response) {
		return handleBadResponseError(e, err.response);
	}

	if (err.request) {
		return handleNoResponseError(e);
	}

	return handleUnknownRequestError(e);
}


// To give users as much information as possible
// (when an error occurs), we'll wrap the response
// of all API requests and check specific error values.
const wrapResponse = (data: any): APIResponse => {
	// errorType is only given from an AxiosError,
	// so we always know that, if this is defined,
	// something for-sure went wrong. Therefore,
	// we can pass a static error value.

	if (data.errorType) {
		return {
			type: 'error',
			...data,
		}
	}

	if (data) {
		return {
			type: 'success',
			errorType: false,
			data,
		};
	}

	// Default to an empty value
	return {
		type: 'empty',
		errorType: false,
		data: undefined,
	}
}

export {
	handleRequestError,
	wrapResponse,
}

export type {
	APIError,
}