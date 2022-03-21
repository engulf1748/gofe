import { useEffect, useState } from "react";
import { SearchIcon } from '@heroicons/react/outline';

const SearchBar = () => {
	const [query, setQuery] = useState('');

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

	const onChange = (ev: any) => {
		if (ev.target) {
			setQuery(ev.target.value);
		}
	}

	return (
		<div className='w-100p flex align-c justify-c flex-row relative mw-20r'>
			<input
				type='text'
				placeholder='Search privately...'
				onChange={onChange}
				className='search-bar shadow-sm'
			/>

			<button className='search-icon flex-c'>
				<i className='j-icon'>
					<SearchIcon />
				</i>
			</button>
		</div>
	);
}

export default SearchBar;