import { MutableRefObject, useCallback } from "react";
import { useRouter } from "next/router";

import { useQuery } from "../../../providers/QueryProvider";

import { getSearchPageURL } from "../../../logic/query";
import { icons } from "../../../data/icons";
import Keyboard from "../../Keyboard";

interface Props {
	inputRef: MutableRefObject<any>;
	setShowSuggestions(v: boolean): void;
	close(): void;
	inNav?: boolean;
}

const Input = ({ inputRef, setShowSuggestions, close, inNav }: Props) => {
	const { query, setQuery, previousQuery } = useQuery();
	const { push } = useRouter();

	const onChange = (ev: any) => {
		setQuery(ev.target?.value);
	}

	const onInputClick = (ev: any) => {
		ev.stopPropagation();
		setShowSuggestions(true);
	}

	const submit = useCallback(() => {
		if (query !== previousQuery) {
			push(getSearchPageURL(query, 1));
			close();
		}
	}, [query]);

	return (
		<div className="input-wrapper">
			<input
				ref={inputRef}
				type='text'
				placeholder='Search privately...'
				className='sb-input'
				value={query}
				onChange={onChange}
				onClick={onInputClick}
				autoFocus={!inNav}
			/>

			<button className='sb-button' onClick={submit} title={`Search for "${query}"`}>
				<span className="sr-only">Search for {query}</span>
				<i className="j-icon">{icons.search}</i>
			</button>

			<Keyboard
				keys={['enter']}
				callback={() => {
					submit();
				}}
				handleFocusableElements
			/>
		</div>
	);
};

export default Input;