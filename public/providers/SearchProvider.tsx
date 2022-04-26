import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react';

import { usePrevious } from '../hooks/usePrevious';

import type { APIResponse, ChildrenOnly } from '../types/util';

import suggestionAPI from '../services/suggestions';

interface TSearchContext {
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
	previousQuery: string;
	suggestions: string[] | undefined;
	status: Status;
	getSuggestions(query: string): Promise<never[] | APIResponse>
}

type Status = 'idle' | 'loading' | 'error' | 'noresults' | 'success';

const SearchContext = createContext<any>({});

const SearchProvider = ({ children }: ChildrenOnly) => {
	const [currentQuery, setCurrentQuery] = useState('');
	const previousQuery = usePrevious(currentQuery);

	const [suggestions, setSuggestions] = useState<string[] | undefined>([]);
	const [status, setStatus] = useState<Status>('idle');

	const getSuggestions = (query: string) => {
		return suggestionAPI
			.getSuggestions(query)
			.then(data => {
				if (data.type === 'empty') {
					setSuggestions([]);
					setStatus('noresults');
					return [];
				}
	
				if (data.type === 'success' && data.data && data.data.length  === 2) {
					setSuggestions(data.data[1]);
					setStatus('success');
					return data;
				}
	
				setSuggestions([]);
				return [];
			});
	}

	useEffect(() => {
		if (currentQuery.trim() && currentQuery !== previousQuery) {
			setStatus('loading');
			getSuggestions(currentQuery);
		}
	}, [currentQuery, previousQuery]);

	useEffect(() => {
		if (currentQuery.trim() === '') {
			setSuggestions([]);
		}
	}, [currentQuery]);

	const value: TSearchContext = {
		query: currentQuery,
		setQuery: setCurrentQuery,
		previousQuery,
		suggestions,
		status,
		getSuggestions,
	};

	return (
		<SearchContext.Provider value={value}>
			{children}
		</SearchContext.Provider>
	);
}

const useSearch = () => {
	return useContext(SearchContext);
}

export default SearchProvider;

export {
	useSearch,
}