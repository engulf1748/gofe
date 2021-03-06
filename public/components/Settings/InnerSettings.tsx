import { useSettings } from "../../providers/SettingsProvider";

import SelectSetting from "./SelectSetting";
import CheckboxSetting from "./CheckboxSetting";
import ExternalLink from "../ExternalLink";

import pkg from '../../package.json';
import { themes } from "../../data/themes";
import { resetLocalStorage } from "../../logic/utils";

const InnerSettings = () => {
	const settings = useSettings();
	
	return (
		<div className='w-100p'>
			<div className="p-1-5r">
				<div className='w-100p grid grid-2 settings-modal-grid mp-grid-1'>
					<SelectSetting id='theme' label='Theme' options={themes} />
					<SelectSetting
						id='suggestionsView'
						label='View suggestions as:'
						options={['list', 'grid']}
					/>
					{settings.theme === 'custom' && (
						<div className="grid-block grid-span-column-2 mp-grid-span-column-1">
							<div className='h-label-container'>
								<div className='h-label flex flex-row align-c justify-s'>
									<span className="lh-1">CSS file URL</span>
									<ExternalLink
										href="https://codeberg.org/ar324/gofe/wiki/Custom-themes"
										className="link sm lh-1 ml-0-25r"
									>
										(What's this?)
									</ExternalLink>
								</div>
								<input
									className="input"
									placeholder="https://www.example.com/gofe-theme.css"
									onChange={(ev) => settings.set('customTheme', ev.target.value)}
									value={settings.customTheme}
								/>
							</div>
						</div>
					)}
					<CheckboxSetting
						id='openLinksInNewTab'
						label='Open links in new tab?'
						options={['Yes', 'No']}
					/>
					<CheckboxSetting
						id='preferIcons'
						label='Prefer icons over text?'
						options={['Yes', 'No']}
					/>
				</div>
			</div>
			<div className='px-1-5r py-1-25r border-top-ui-2 flex-sb'>
				<div className="flex-r mp-flex-c">
					<ExternalLink href='https://codeberg.org/ar324/gofe/releases' className='link sm lh-1'>
						v{pkg.version}
					</ExternalLink>
				</div>
				<a onClick={() => resetLocalStorage(true)} className='link sm'>
					Reset to default
				</a>
			</div>
		</div>
	);
};

export default InnerSettings;
