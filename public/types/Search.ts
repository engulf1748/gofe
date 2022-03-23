interface TextResult {
	URL: string;
	Desc: string;
	Context: string;
}

// In the future, we can add other result
// types here, if needed.
type Result = TextResult;

export type {
	TextResult,
	Result,
}