import { Modal } from "@infinium/hydro";

import SelectSetting from "./SelectSetting";

import { themes } from "../../data/themes";
import CheckboxSetting from "./CheckboxSetting";


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
				okayButtonText: 'Close',
			}}
			background='medium'
		>
			<div className='w-100p mt-1r'>
				<div className="w-100p grid grid-2 settings-modal-grid">
					<SelectSetting id='theme' label='Theme' options={themes} />
					<SelectSetting id='suggestionsView' label='View suggestions as' options={['list', 'grid']} />
					<CheckboxSetting id='openLinksInNewTab' label='Open links in new tab?' options={['Yes', 'No']} />
					<CheckboxSetting id='preferIcons' label='Prefer icons over text?' options={['Yes', 'No']} />
				</div>
			</div>
		</Modal>
	);
};

export default SettingsModal;