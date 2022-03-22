import Logo from "../Logo";
import SearchBar from "../SearchBar";

interface Props {

}

const Navigation = ({  }: Props) => {
	return (
		<nav>
			<div className="wrapper flex-c">
				<div className='w-100p h-100p grid grid-3 gap-0 landscape-grid-2'>
					<div className='grid-block justify-s align-c flex-row'>
						<Logo />
						<div className="ml-1r w-100p mw-20r">
							<SearchBar />
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};


export default Navigation;