import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react';

import { usePrevious } from '../hooks/usePrevious';

import type { ChildrenOnly } from '../types/util';

import suggestionAPI from '../services/suggestions';

interface TQueryContext {
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
	previousQuery: string;
	suggestions: string[] | undefined;
}

const QueryContext = createContext<any>({});

const QueryProvider = ({ children }: ChildrenOnly) => {
	const [query, setQuery] = useState('');
	const previousQuery = usePrevious(query);
	const [suggestions, setSuggestions] = useState<string[] | undefined>([]);

	useEffect(() => {
		if (query.trim() && query !== previousQuery) {
			suggestionAPI
				.getSuggestions(query)
				.then(data => data)
				.catch(err => {
					console.error(err);
					return err;
				})
				.then(data => {
					if (!data || data.length !== 2) {
						setSuggestions(undefined);
					}

					setSuggestions(data[1]);
				})
		}
	}, [query, previousQuery]);

	useEffect(() => {
		if (query.trim() === '') {
			setSuggestions([]);
		}
	}, [query]);

	const value: TQueryContext = {
		query,
		setQuery,
		previousQuery,
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