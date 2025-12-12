/* global wjlcData */
import PhoneSettings from './sections/phone-settings/phone_settings';
import IconSelector from './sections/icon-selector/icon_selector';
import FloatingButtonOptions from './sections/floating-button-options/floating_button_options';
// import PreviewBox from './sections/preview-box/preview_box';
import { notifySuccess, toastError } from '../../../utils/notifications';
import './general_tab.css';

export default function GeneralTab({ globalSettings, updateSettings }) {
	const general = globalSettings.general || {
		phone: {},
		icon: {},
		floating: {},
	};

	const updateGeneral = (field, values) => {
		updateSettings(field, {
			...general[field],
			...values,
		});
	};

	// GUARDAR CAMBIOS EN BACKEND
	const saveAllChanges = async () => {
		const payload = {
			phone: globalSettings.general.phone,
			icon: globalSettings.general.icon,
			floating: globalSettings.general.floating,
		};

		console.log('📤 Enviando al backend (save-general-settings):', payload);

		try {
			const res = await fetch('/wp-json/wjlc/v1/save-general-settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': wjlcData.nonce,
				},
				body: JSON.stringify(payload),
			});

			const json = await res.json();
			console.log('📥 Respuesta del backend:', json);

			if (!res.ok || !json.success) {
				throw new Error('Error en la petición');
			}

			notifySuccess('Cambios guardados correctamente');
		} catch (error) {
			console.error('❌ Error al guardar:', error);
			toastError('Error al guardar los cambios');
		}
	};

	return (
		<div className="jlc-general-page">
			<h1 className="jlc-page-title">Configuración General</h1>

			<div className="jlc-sections-wrapper">
				<div className="jlc-section-card">
					<PhoneSettings
						settings={globalSettings.general.phone}
						onChange={(data) => updateSettings('phone', data)}  
					/>
				</div>

				<div className="jlc-section-card">
					<IconSelector
						settings={globalSettings.general.icon}
						onChange={(data) => updateSettings('icon', data)}
					/>
				</div>

				<div className="jlc-section-card">
					<FloatingButtonOptions
						settings={globalSettings.general.floating}
						onChange={(data) => updateGeneral('floating', data)}
					/>
				</div>

				{/* <div className="jlc-section-card jlc-section-card__previewbox">
					<PreviewBox settings={globalSettings} />
				</div> */}

				<button
					className="jlc-save-btn jlc-btn-primary"
					onClick={saveAllChanges}
				>
					Guardar cambios
				</button>
			</div>
		</div>
	);
}
