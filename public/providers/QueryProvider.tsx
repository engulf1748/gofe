import React, {
	createContext,
	useContext,
	useState,
	useEffect,
} from 'react';

import type { ChildrenOnly } from '../types/util';


const QueryContext = createContext<any>({});

const QueryProvider = ({ children }: ChildrenOnly) => {
	const [query, setQuery] = useState('');

	useEffect(() => {
		
	}, [query]);

	const value = [
		query,
		setQuery
	];

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