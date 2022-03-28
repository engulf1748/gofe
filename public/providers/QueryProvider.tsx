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
	status: Status;
}

type Status = 'idle' | 'loading' | 'error' | 'noresults' | 'success';

const QueryContext = createContext<any>({});

const QueryProvider = ({ children }: ChildrenOnly) => {
	const [query, setQuery] = useState('');
	const previousQuery = usePrevious(query);

	const [suggestions, setSuggestions] = useState<string[] | undefined>([]);
	const [status, setStatus] = useState<Status>('idle');

	useEffect(() => {
		if (query.trim() && query !== previousQuery) {
			setStatus('loading');

			suggestionAPI
				.getSuggestions(query)
				.then(data => {
					if (data.type === 'empty') {
						setSuggestions([]);
						setStatus('noresults');
						return;
					}

					if (data.type === 'success' && data.data && data.data.length  === 2) {
						setSuggestions(data.data[1]);
						setStatus('success');
						return;
					}

					setSuggestions([]);
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
		status,
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