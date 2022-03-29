import Logo from "../Logo";
import SearchBar from "../search/SearchBar";
import Settings from "../Settings";


const Navigation = () => {
	return (
		<nav>
			<div className="wrapper flex-c">
				<div className='w-100p h-100p grid grid-3 gap-0 tablet-grid-2 landscape-grid-1'>
					<div className='primary-grid-block grid-block justify-s align-c flex-row'>
						<Logo clearQueryOnClick />
						<div className="w-100p mw-20r landscape-mw-none">
							<SearchBar inNav />
						</div>
					</div>
					<div className="grid-block tablet-hide"></div>
					<div className="grid-block align-e landscape-hide">
						<Settings />
					</div>
				</div>
			</div>
		</nav>
	);
};


export default Navigation;