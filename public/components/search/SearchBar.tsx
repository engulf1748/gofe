import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

import { useQuery } from "../../providers/QueryProvider";

import Keyboard from "../Keyboard";

import { getSearchPageURL } from '../../logic/query';

import { icons } from '../../data/icons';


interface Props {
	inNav?: boolean;
}

interface SuggestionsProps {
	suggestions: string[];
	setShowSuggestions(v: boolean): void;
}

interface SuggestionProps {
	suggestion: string;
	setShowSuggestions(v: boolean): void;
}

const Suggestion = ({ suggestion, setShowSuggestions }: SuggestionProps) => {
	const { setQuery } = useQuery();
	const { push } = useRouter();

	const onClick = useCallback(() => {
		setQuery(suggestion);
		push(getSearchPageURL(suggestion, 1));

		// Due to the way updates flow through React,
		// arbitrary timeouts are sometimes necessary
		// for more complicated UI views.
		setTimeout(() => setShowSuggestions(false), 30);
	}, [suggestion]);

	return (
		<button className="search-suggestion" onClick={onClick}>{suggestion}</button>
	);
}

const Suggestions = ({ suggestions, setShowSuggestions }: SuggestionsProps) => {
	return (
		<div className='search-suggestions shadow-sm'>
			{suggestions ? (
				suggestions.map(suggestion => (
					<Suggestion
						key={suggestion}
						suggestion={suggestion}
						setShowSuggestions={setShowSuggestions}
					/>
				))
			) : (
				<p className='my-0-5r fs-sm text-dynamic-08'>Unable to fetch suggestions.</p>
			)}
		</div>
	);
}

const SearchBar = ({ inNav }: Props) => {
	const { query, setQuery, previousQuery, suggestions } = useQuery();
	const { push, query: routerQuery } = useRouter();
	const inputRef = useRef();

	const [showSuggestions, setShowSuggestions] = useState(false);

	const close = () => setShowSuggestions(false);

	useEffect(() => {
		if (routerQuery.q) {
			setQuery(routerQuery.q);
		}
	}, []);

	useEffect(() => {
		if (showSuggestions) {
			document.addEventListener('click', close);
		}

		return () => document.removeEventListener('click', close);
	}, [showSuggestions]);

	useEffect(() => {
		if (query.trim() !== '' && query !== previousQuery) {
			setShowSuggestions(suggestions.length !== 0);
		} else {
			setShowSuggestions(false);
		}
	}, [query]);

	const focus = () => {
		// We can ignore this because React ensures
		// that the current object will point to the
		// target DOM node.
		// @ts-ignore
		inputRef.current.focus();
		
		if (query.trim() !== '') {
			setShowSuggestions(true);
		}
	}

	const onChange = (ev: any) => {
		if (ev.target) {
			setQuery(ev.target.value);
		}
	}

	const onInputClick = useCallback(() => {
		if (suggestions && suggestions.length !== 0) {
			setShowSuggestions(true);
		}
	}, [suggestions]);

	const onSearchButtonClick = () => {
		if (query === '') {
			focus();
			return;
		}

		push(getSearchPageURL(query, 1));
	}

	return (
		<>
			<div className={classNames([
				'search-wrapper',
				showSuggestions && 'showing-suggestions shadow-sm'
			])}>
				<div className='search-bar-wrapper w-100p flex align-c justify-c flex-row relative'>
					<input
						// At this point, TS is just being
						// annoying here. We can ignore this
						// because useRef generated this value
						// directly.
						// @ts-ignore
						ref={inputRef}
						type='text'
						placeholder='Search privately...'
						value={query}
						onChange={onChange}
						className='search-bar shadow-sm'
						onClick={onInputClick}
						autoFocus={!inNav}
					/>

					<button className='search-icon flex-c' onClick={onSearchButtonClick}>
						<i className='j-icon'>{icons.search}</i>
					</button>
				</div>
				{showSuggestions && suggestions && suggestions.length !== 0 && (
					<Suggestions
						suggestions={suggestions}
						setShowSuggestions={setShowSuggestions}
					/>
				)}
			</div>

			<Keyboard
				keys={['/']}
				callback={(key, ev) => {
					ev.preventDefault();
					focus();
				}}
			/>

			<Keyboard
				keys={['enter', 'esc']}
				callback={(key, ev) => {
					if (key === 'enter') {
						ev.preventDefault();
						onSearchButtonClick();
					}

					if (key === 'esc') {
						// See focus() method for why we ignore this
						// @ts-ignore
						inputRef?.current?.blur();
					}

					setShowSuggestions(false);
				}}
				handleFocusableElements
			/>
		</>
	);
}

export default SearchBar;