import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import Input from "./Input";
import Suggestions from "./Suggestions";


interface Props {
	inNav?: boolean;
}

const SearchBar = ({ inNav }: Props) => {
	const [showSuggestions, setShowSuggestions] = useState(!inNav);
	const inputRef = useRef();

	const close = () => {
		setShowSuggestions(false);
		
		try {
			// @ts-ignore
			inputRef.current.blur();
		} catch {}
	};

	useEffect(() => {
		if (showSuggestions) {
			document.addEventListener('click', close);
		}

		return () => {
			document.removeEventListener('click', close);
		}
	})

	return (
		<div className={classNames(
			'search-bar',
			inNav && 'in-nav',
		)}>
			<Input
				inputRef={inputRef}
				setShowSuggestions={setShowSuggestions}
				close={close}
				inNav={inNav}
			/>
			
			{showSuggestions && <Suggestions inputRef={inputRef} close={close} />}

		</div>
	);
}

export default SearchBar;