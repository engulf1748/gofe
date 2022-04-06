import { icons } from "../data/icons";


interface Props {
	title: string;
	onClick(ev: any): void;
	icon: string;
	active?: boolean;
}

const MiniButton = ({ title, onClick, icon, active }: Props) => {
	return (
		<button onClick={onClick} title={title} className={active ? 'active' : ''}>
			<span className="sr-only">{title}</span>
			<i className="j-icon xs">{icons[icon]}</i>
		</button>
	);
};

export default MiniButton;