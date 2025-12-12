/* global wjlcData */
import CustomCSSSection from './sections/custom-css/custom_css_section';
import { notifySuccess, toastError } from '../../../utils/notifications';
import './avanzado_tab.css';

export default function AvanzadoTab({ globalSettings, updateSettings }) {
	// Estado local de la sección avanzada
	const avanzado = globalSettings.avanzado || {
		custom_css: '',
	};

	// Actualizar campo dentro de globalSettings.avanzado
	const updateAvanzado = (values) => {
		updateSettings('avanzado', {
			...avanzado,
			...values,
		});
	};

	// GUARDAR CAMBIOS EN BACKEND
	const saveAllChanges = async () => {
		const payload = {
			custom_css: globalSettings.avanzado?.custom_css || '',
		};

		console.log('📤 Enviando al backend (save-advanced-settings):', payload);

		try {
			const res = await fetch('/wp-json/wjlc/v1/save-advanced-settings', {
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

			notifySuccess('Cambios avanzados guardados correctamente');
		} catch (error) {
			console.error('❌ Error al guardar avanzado:', error);
			toastError('Error al guardar los cambios avanzados');
		}
	};

	return (
		<section className="jlc-advanced-page">
			<h1 className="jlc-page-title">Ajustes avanzados</h1>

			<div className="jlc-advanced-container">
				<div className="jlc-advanced-card">
					{/* Sección del editor CSS */}
					<CustomCSSSection
						settings={globalSettings.avanzado}
						onChange={(data) => updateAvanzado(data)}
					/>

					{/* Botón guardar */}
					<button className="jlc-btn-primary" onClick={saveAllChanges}>
						Guardar cambios
					</button>
				</div>
			</div>
		</section>
	);
}
