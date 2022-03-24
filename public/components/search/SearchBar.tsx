import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

import { useQuery } from "../../providers/QueryProvider";

import Keyboard from "../Keyboard";

import { getSearchPageURL } from '../../logic/query';

import { icons } from '../../data/icons';


interface SuggestionsProps {
	suggestions: string[];
}

interface SuggestionProps {
	suggestion: string;
}

const Suggestion = ({ suggestion }: SuggestionProps) => {
	const { setQuery } = useQuery();
	const { push } = useRouter();

	const onClick = () => {
		setQuery(suggestion);
		push(getSearchPageURL(suggestion, 1));
	}

	return (
		<button className="search-suggestion" onClick={onClick}>{suggestion}</button>
	);
}

const Suggestions = ({ suggestions }: SuggestionsProps) => {
	return (
		<div className="search-suggestions shadow-sm">
			{suggestions.map(suggestion => (
				<Suggestion key={suggestion} suggestion={suggestion} />
			))}
		</div>
	);
}

const SearchBar = () => {
	const { query, setQuery, suggestions } = useQuery();
	const { push, query: routerQuery } = useRouter();
	const inputRef = useRef();

	const [shouldShowSuggestions, setShouldShowSuggestions] = useState(false);

	const close = () => setShouldShowSuggestions(false);

	useEffect(() => {
		if (routerQuery.q) {
			setQuery(routerQuery.q);
		}
	}, []);

	useEffect(() => {
		if (shouldShowSuggestions) {
			document.addEventListener('click', close);
		}

		return () => document.removeEventListener('click', close);
	}, [shouldShowSuggestions]);

	const focus = () => {
		// We can ignore this because React ensures
		// that the current object will point to the
		// target DOM node.
		// @ts-ignore
		inputRef.current.focus();
	}

	const onChange = (ev: any) => {
		if (ev.target) {
			setQuery(ev.target.value);
		}
	}

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
				shouldShowSuggestions && 'showing-suggestions shadow-sm'
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
						onChange={onChange}
						defaultValue={query}
						className='search-bar shadow-sm'
						onClick={() => setShouldShowSuggestions(true)}
					/>

					<button className='search-icon flex-c' onClick={onSearchButtonClick}>
						<i className='j-icon'>{icons.search}</i>
					</button>
				</div>
				{shouldShowSuggestions && (
					<Suggestions suggestions={suggestions} />
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

					setShouldShowSuggestions(false);
				}}
				handleFocusableElements
			/>
		</>
	);
}

export default SearchBar;