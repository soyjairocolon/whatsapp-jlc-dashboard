/* global wjlcData */
import { useState, useEffect } from 'react';
import PhoneSettings from './sections/phone-settings/phone_settings';
import IconSelector from './sections/icon-selector/icon_selector';
import FloatingButtonOptions from './sections/floating-button-options/floating_button_options';
import PreviewBox from './sections/preview-box/preview_box';
import './general_tab.css';

export default function GeneralTab() {
	const [globalData, setGlobalData] = useState({
		phone: {},
		icon: {},
		floating: {},
	});

	// ============================
	// GET SETTINGS (CARGA INICIAL)
	// ============================
	useEffect(() => {
		async function loadSettings() {
			try {
				const res = await fetch('/wp-json/wjlc/v1/general-settings', {
					method: 'GET',
					headers: {
						'X-WP-Nonce': wjlcData.nonce,
					},
				});

				const data = await res.json();

				if (data.success && data.settings) {
					setGlobalData(data.settings);
				}
			} catch (error) {
				console.error('Error cargando ajustes generales:', error);
			}
		}

		loadSettings();
	}, []);

	// ============================
	// ACTUALIZAR SECCIÓN INDIVIDUAL
	// ============================
	const updateSectionData = (section, values) => {
		setGlobalData((prev) => ({
			...prev,
			[section]: { ...prev[section], ...values },
		}));
	};

	// ============================
	// GUARDAR TODO
	// ============================
	const saveAllChanges = async () => {
		const payload = {
			phone: globalData.phone,
			icon: globalData.icon,
			floating: globalData.floating,
		};

		console.log('Datos enviados al servidor:', payload);

		try {
			const res = await fetch('/wp-json/wjlc/v1/save-general-settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': wjlcData.nonce,
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) throw new Error('Error en la petición');

			alert('Cambios guardados correctamente');
		} catch (error) {
			console.error(error);
			alert('Error al guardar los cambios');
		}
	};

	return (
		<div className="jlc-general-page">
			<h1 className="jlc-page-title">Configuración General</h1>

			<div className="jlc-sections-wrapper">
				<div className="jlc-section-card">
					<PhoneSettings
						onChange={(data) => updateSectionData('phone', data)}
					/>
				</div>

				<div className="jlc-section-card">
					<IconSelector
						settings={globalData.icon}
						onChange={(updated) => updateSectionData('icon', updated)}
					/>
				</div>

				<div className="jlc-section-card">
					<FloatingButtonOptions
						onChange={(data) => updateSectionData('floating', data)}
					/>
				</div>

				<div className="jlc-section-card">
					<PreviewBox />
				</div>

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
