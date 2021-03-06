import Logo from "../Logo";
import SearchBar from "../search/SearchBar";
import Settings from "../Settings";


const Navigation = () => {
	return (
		<nav>
			<div className="wrapper flex-c">
				<div className='w-100p h-100p flex-sb nav-desktop'>
					<div className='w-100p flex justify-s align-c flex-row'>
						<Logo clearQueryOnClick />
						<div className="searchbar-container w-100p mw-25r flex-c">
							<SearchBar inNav />
						</div>
					</div>
					<div className="">
						<div className="settings-wrapper">
							<Settings />
						</div>
					</div>
				</div>

				<div className="nav-mobile w-100p flex-c">
					<div className="w-100p flex-c pt-0-5r">
						<div className="w-100p flex-sb py-0-5r pr-2r">
							<Logo clearQueryOnClick />
							<div className="settings-wrapper">
								<Settings />
							</div>
						</div>
						<div className="w-100p flex-c px-2r pb-1r">
							<SearchBar inNav />
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};


export default Navigation;