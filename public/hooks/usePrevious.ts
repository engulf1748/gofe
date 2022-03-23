// This hook tracks the state changes of
// `value` and returns the previously
// saved value.

import { useRef, useEffect } from 'react';

const usePrevious = (value: any) => {
	const ref = useRef();

	useEffect(() => {
		ref.current = value;
	});

	return ref.current;
};

export { usePrevious };
