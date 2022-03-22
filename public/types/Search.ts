interface TextResult {
	href: string;
	description: string;
	context: string;
}

// In the future, we can add other result
// types here, if needed.
type Result = TextResult;

export type {
	TextResult,
	Result,
}