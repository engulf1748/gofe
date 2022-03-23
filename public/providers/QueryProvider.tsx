import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react';

import type { ChildrenOnly } from '../types/util';

import { suggestions as STATIC_SUGGESTIONS } from '../data/suggestions.tmp';

interface TQueryContext {
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
	suggestions: string[];
}

const QueryContext = createContext<any>({});

const QueryProvider = ({ children }: ChildrenOnly) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState(STATIC_SUGGESTIONS);

	useEffect(() => {
		
	}, [query]);

	const value: TQueryContext = {
		query,
		setQuery,
		suggestions,
	};

	return (
		<QueryContext.Provider value={value}>
			{children}
		</QueryContext.Provider>
	);
}

const useQuery = () => {
	return useContext(QueryContext);
}

export default QueryProvider;

export {
	useQuery,
}