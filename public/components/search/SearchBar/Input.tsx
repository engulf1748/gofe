import { MutableRefObject, useCallback } from "react";
import { useRouter } from "next/router";

import { useQuery } from "../../../providers/QueryProvider";

import { getSearchPageURL } from "../../../logic/query";
import { icons } from "../../../data/icons";

interface Props {
	inputRef: MutableRefObject<any>;
	setShowSuggestions(v: boolean): void;
}

const Input = ({ inputRef, setShowSuggestions }: Props) => {
	const { query, setQuery } = useQuery();
	const { push } = useRouter();

	const onChange = (ev: any) => {
		setQuery(ev.target?.value);
	}

	const onInputClick = (ev: any) => {
		ev.stopPropagation();
		setShowSuggestions(true);
	}

	const submit = useCallback(() => {
		push(getSearchPageURL(query, 1));
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
			/>

			<button className='sb-button' onClick={submit}>
				<i className="j-icon">{icons.search}</i>
			</button>
		</div>
	);
};

export default Input;