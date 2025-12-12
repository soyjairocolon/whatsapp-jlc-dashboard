/* global wjlcData */
import { useState } from 'react';
import { notifySuccess, toastError } from '../../../utils/notifications';
import CustomCSSSection from './sections/custom-css/custom_css_section';
import CustomJSPremiumSection from './sections/custom-js-premium/custom_js_premium_section';
import GtmPremiumSection from './sections/gtm-premium/gtm_premium_section';
import './avanzado_tab.css';

export default function AvanzadoTab({ globalSettings, updateSettings }) {
	const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);

	const openPremiumModal = () => setPremiumModalOpen(true);
	const closePremiumModal = () => setPremiumModalOpen(false);

	// ===========================================
	// ESTADO LOCAL (SIEMPRE REFLEJA EL BACKEND
	// ===========================================
	const avanzado = {
		custom_css: globalSettings.avanzado?.custom_css ?? '',
		custom_js: globalSettings.avanzado?.custom_js ?? '',

		gtm: {
			enabled: !!globalSettings.avanzado?.gtm?.enabled,
			container_id: globalSettings.avanzado?.gtm?.container_id ?? '',
			event_name:
				globalSettings.avanzado?.gtm?.event_name ?? 'jlc_whatsapp_click',
			meta_event_name:
				globalSettings.avanzado?.gtm?.meta_event_name ?? 'jlc_whatsapp_meta',

			params: {
				phone: !!globalSettings.avanzado?.gtm?.params?.phone,
				page: !!globalSettings.avanzado?.gtm?.params?.page,
				timestamp: !!globalSettings.avanzado?.gtm?.params?.timestamp,
				type: !!globalSettings.avanzado?.gtm?.params?.type,
				utm: !!globalSettings.avanzado?.gtm?.params?.utm,
			},
		},
	};

	// ===========================================================
	// ACTUALIZAR ESTADO GLOBAL DE MANERA PROFUNDA (MERGE CORRECTO)
	// ===========================================================
	const updateAvanzado = (values) => {
		const newState = {
			...globalSettings.avanzado,
			...values,

			gtm: {
				...globalSettings.avanzado?.gtm,
				...(values.gtm || {}),

				params: {
					...globalSettings.avanzado?.gtm?.params,
					...(values.gtm?.params || {}),
				},
			},
		};

		updateSettings('avanzado', newState);
	};

	// ===========================================================
	// GUARDAR AJUSTES EN BACKEND
	// ===========================================================
	const saveAllChanges = async () => {
		const payload = {
			custom_css: avanzado.custom_css,
			custom_js: avanzado.custom_js,
			gtm: avanzado.gtm,
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

	// ===========================================================
	// RENDER
	// ===========================================================
	return (
		<section className="jlc-advanced-page">
			{/* MODAL PREMIUM */}
			{isPremiumModalOpen && (
				<div className="jlc-premium-modal-overlay" onClick={closePremiumModal}>
					<div
						className="jlc-premium-modal"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="jlc-premium-modal-title">Pásate a Premium</h2>
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
						settings={avanzado}
						onChange={(data) => updateAvanzado(data)}
					/>

					<CustomJSPremiumSection
						settings={avanzado}
						onChange={(data) => updateAvanzado(data)}
						openPremiumModal={openPremiumModal}
					/>

					<GtmPremiumSection
						settings={avanzado}
						onChange={(data) => updateAvanzado(data)}
						openPremiumModal={openPremiumModal}
					/>

					<button className="jlc-btn-primary" onClick={saveAllChanges}>
						Guardar cambios
					</button>
				</div>
			</div>
		</section>
	);
}
