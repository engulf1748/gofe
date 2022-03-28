import type { APIError } from "../services/err";

interface ChildrenOnly {
	children: React.ReactNode;
}

interface APIResponse {
	type: 'error' | 'success' | 'empty';
	errorType: APIError | false;
	data: any;
}

export type {
	ChildrenOnly,
	APIResponse,
}