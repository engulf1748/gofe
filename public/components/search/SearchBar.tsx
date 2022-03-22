import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Keyboard from "../Keyboard";

import { icons } from '../../data/icons';

const SearchBar = () => {
	const [query, setQuery] = useState('');
	const { push } = useRouter();
	const inputRef = useRef();

	useEffect(() => {
		// This is where we'll query for autocomplete,
		// if we're even doing that. The onChange fires
		// for each keypress, so that's a lot of API calls
		// all at once. We can instead, however, attach a
		// onBlur listener that will fire when the user clicks
		// outside of the input or when they press enter.
		// This is a matter of preference (and system capacity
		// if we're doing the onChange event).
	}, [query]);

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

		push(`/search?q=${query}`);
	}

	return (
		<>
			<div className='w-100p flex align-c justify-c flex-row relative mw-20r'>
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
					className='search-bar shadow-sm'
				/>

				<button className='search-icon flex-c' onClick={onSearchButtonClick}>
					<i className='j-icon'>{icons.search}</i>
				</button>
			</div>

			<Keyboard
				keys={['/']}
				callback={(key, ev) => {
					ev.preventDefault();
					focus();
				}}
			/>

			<Keyboard
				keys={['enter']}
				callback={(key, ev) => {
					ev.preventDefault();
					onSearchButtonClick();
				}}
				handleFocusableElements
			/>
		</>
	);
}

export default SearchBar;