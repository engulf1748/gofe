import Image from 'next/image';
import { isMobile } from 'react-device-detect';

interface Props {
	title: string;
	children: React.ReactNode;
}

const BaseNotice = ({ title, children }: Props) => {
	return (
		<div className="w-100p mw-35r p-1-5r ml-py-0 border-ui-2 radius-0-5r bg">
			<div className="w-100p grid grid-2 ml-grid-1">
				<div className="grid-block ml-flex-c ml-text-c ml-pt-1r">
					<h1 className="fs-xl fw-500 mb-0-5r">{title}</h1>
					{children}
				</div>
				<div className="grid-block align-e ml-align-c">
					<Image
						src='/customize-promo.png'
						height={isMobile ? 150 : 200}
						width={isMobile ? 150 : 200}
					/>
				</div>
			</div>
		</div>
	);
};

export default BaseNotice;