import { useTheme } from "next-themes";
import { icons } from "../../data/icons";

import Logo from "../Logo";
import SearchBar from "../search/SearchBar";


const Navigation = () => {
	const { theme, setTheme } = useTheme();

	const onClick = () => {
		// Since the default theme is system, we can't toggle
		// that value directly. Instead, we have to see what theme
		// the user currently has. The only way is to check the
		// class output from the html element.
		const isDark = document.querySelector('html')?.classList.contains('dark');
		setTheme(isDark ? 'light' : 'dark');
	}

	return (
		<nav>
			<div className="wrapper flex-c">
				<div className='w-100p h-100p grid grid-3 gap-0 tablet-grid-2 landscape-grid-1'>
					<div className='primary-grid-block grid-block justify-s align-c flex-row'>
						<Logo />
						<div className="w-100p mw-20r landscape-mw-none">
							<SearchBar />
						</div>
					</div>
					<div className="grid-block tablet-hide"></div>
					<div className="grid-block align-e landscape-hide">
						<button className='action' onClick={onClick}>
							<i className="j-icon">{theme === 'dark' ? icons.sun : icons.moon}</i>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};


export default Navigation;