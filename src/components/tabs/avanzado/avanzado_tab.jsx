/* global wjlcData */
import { useState } from 'react';
import { notifySuccess, toastError } from '../../../utils/notifications';
import CustomCSSSection from './sections/custom-css/custom_css_section';
import CustomJSPremiumSection from './sections/custom-js-premium/custom_js_premium_section';
import './avanzado_tab.css';

export default function AvanzadoTab({ globalSettings, updateSettings }) {
	const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);

	const openPremiumModal = () => setPremiumModalOpen(true);
	const closePremiumModal = () => setPremiumModalOpen(false);

	// Estado local de la sección avanzada
	const avanzado = globalSettings.avanzado || {
		custom_css: '',
		custom_js: '',
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
			custom_js: globalSettings.avanzado?.custom_js || '',
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
			{isPremiumModalOpen && (
				<div className="jlc-premium-modal-overlay" onClick={closePremiumModal}>
					<div
						className="jlc-premium-modal"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="jlc-premium-modal-title">
							Pásate a Premium
						</h2>
						<p className="jlc-premium-modal-text">
							Esta funcionalidad es exclusiva para usuarios Premium.
						</p>

						<button className="jlc-btn-primary" onClick={closePremiumModal}>
							Entendido
						</button>
					</div>
				</div>
			)}

			<h1 className="jlc-page-title">Ajustes avanzados</h1>

			<div className="jlc-advanced-container">
				<div className="jlc-advanced-card">
					<CustomCSSSection
						settings={globalSettings.avanzado}
						onChange={(data) => updateAvanzado(data)}
					/>

					<div className="jlc-section-card">
						<CustomJSPremiumSection
							settings={globalSettings.avanzado}
							onChange={(data) => updateAvanzado(data)}
							openPremiumModal={openPremiumModal}
						/>
					</div>

					<button className="jlc-btn-primary" onClick={saveAllChanges}>
						Guardar cambios
					</button>
				</div>
			</div>
		</section>
	);
}
