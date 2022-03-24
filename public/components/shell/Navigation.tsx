import Logo from "../Logo";
import SearchBar from "../search/SearchBar";


const Navigation = () => {
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
				</div>
			</div>
		</nav>
	);
};


export default Navigation;