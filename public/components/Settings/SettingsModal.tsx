import { Modal } from "@infinium/hydro";

import SelectSetting from "./SelectSetting";

import { themes } from "../../data/themes";


interface Props {
	modal: boolean;
	setModal(v: boolean): void;
}

const SettingsModal = ({ modal, setModal }: Props) => {
	return (
		<Modal
			state={modal}
			setState={setModal}
			size='sm'
			modal={{
				title: 'Settings',
				okayButtonText: 'Done',
			}}
			background='medium'
		>
			<div className='w-100p mb-2r mt-1r'>
				<div className="w-100p grid grid-2">
					<SelectSetting id='theme' label='Theme' options={themes} />
					<SelectSetting id='openLinksInNewTab' label='Open links in new tab?' options={['yes', 'no']} />
				</div>
			</div>
		</Modal>
	);
};

export default SettingsModal;