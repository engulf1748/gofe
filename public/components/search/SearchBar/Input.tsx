import { useCallback, useEffect, useState, MutableRefObject } from "react";
import { useRouter } from "next/router";

import { useSearch } from "../../../providers/SearchProvider";

import Keyboard from "../../Keyboard";

import { getSearchPageURL } from "../../../logic/query";
import { icons } from "../../../data/icons";
import classNames from "classnames";

interface Props {
	inputRef: MutableRefObject<any>;
	setShowSuggestions(v: boolean): void;
	close(): void;
	inNav?: boolean;
}

const Input = ({ inputRef, setShowSuggestions, close, inNav }: Props) => {
	const { query, setQuery, previousQuery } = useSearch();
	const { push } = useRouter();
	const [hasFocus, setHasFocus] = useState(!inNav);

	const focus = () => setHasFocus(true);
	const blur = () => setHasFocus(false);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.addEventListener('focus', focus);
			inputRef.current.addEventListener('blur', blur);
		}

		return () => {
			inputRef.current?.removeEventListener('focus', focus);
			inputRef.current?.removeEventListener('blur', blur);
		}
	})

	const onChange = (ev: any) => {
		setQuery(ev.target?.value);
	}

	const onInputClick = (ev: any) => {
		ev.stopPropagation();
		setShowSuggestions(true);
	}

	const submit = useCallback(() => {
		if (query !== previousQuery && query.trim() !== "") {
			push(getSearchPageURL(query, 1));
			close();
		} else {
			try {
				inputRef.current.focus();
			} catch {}
		}
	}, [query]);

	return (
		<div className="input-wrapper">
			<input
				ref={inputRef}
				type='text'
				placeholder='Search privately...'
				className={classNames('sb-input', query !== '' && 'has-x-button')}
				value={query}
				onChange={onChange}
				onClick={onInputClick}
				autoFocus={!inNav}
			/>

			<div className="input-actions">
				{query !== '' && (
					<button className='sb-button clear' onClick={() => setQuery('')} title='Clear query'>
						<span className="sr-only">Clear query</span>
						<i className="j-icon">{icons.x}</i>
					</button>
				)}

				<button className='sb-button' onClick={submit} title={`Search for "${query}"`}>
					<span className="sr-only">Search for {query}</span>
					<i className="j-icon">{icons.search}</i>
				</button>
			</div>

			{hasFocus && (
				<Keyboard
					keys={['enter']}
					callback={() => {
						submit();
					}}
					handleFocusableElements
				/>
			)}
		</div>
	);
};

export default Input;