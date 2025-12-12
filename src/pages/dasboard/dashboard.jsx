/* global wjlcData */
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layouts/dasboard/sidebar/sidebar';
import Content from '../../components/layouts/dasboard/content/content';
import GeneralTab from '../../components/tabs/general/general_tab';
import VisibilidadTab from '../../components/tabs/visibilidad/visibilidad_tab';
import AvanzadoTab from '../../components/tabs/avanzado/avanzado_tab';
import PremiumTab from '../../components/tabs/premium/premium_tab';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInUp } from '../../motion/variants';
import Header from '../../components/layouts/header/header';
import './dashboard.css';

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('general');

	const [globalSettings, setGlobalSettings] = useState({
		general: {
			phone: '',
			initialMessage: '',
			icon: {},
			floating: {},
		},
		visibilidad: {},
		avanzado: {},
		premium: {},
	});

	// ============================
	// CARGA INICIAL DESDE WORDPRESS
	// ============================
	useEffect(() => {
		async function loadAllSettings() {
			try {
				const res = await fetch('/wp-json/wjlc/v1/general-settings', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'X-WP-Nonce': wjlcData.nonce,
					},
				});

				if (!res.ok) {
					console.error('Error HTTP:', res.status);
					return;
				}

				const json = await res.json();

				if (json.success && json.settings) {
					const incomingGeneral = json.settings.general || {};

					// ================================
					// DEFAULTS COMPLETOS PARA GTM
					// ================================
					const defaultsGtm = {
						enabled: false,
						container_id: '',
						event_name: 'jlc_whatsapp_click',
						meta_event_name: 'jlc_whatsapp_meta',
						params: {
							phone: true,
							page: true,
							timestamp: true,
							type: true,
							utm: true,
						},
					};

					const incomingAdv = json.settings.avanzado || {};

					// =========================================
					// MERGE PROFUNDO PARA NO PERDER LOS CHECKS
					// =========================================
					const mergedAdv = {
						custom_css: incomingAdv.custom_css ?? '',
						custom_js: incomingAdv.custom_js ?? '',
						gtm: {
							...defaultsGtm,
							...(incomingAdv.gtm || {}),
							params: {
								...defaultsGtm.params,
								...(incomingAdv.gtm?.params || {}),
							},
						},
					};

					setGlobalSettings((prev) => ({
						...prev,

						...json.settings,

						general: {
							phone: incomingGeneral.phone || {},
							icon: incomingGeneral.icon || {},
							floating: incomingGeneral.floating || {},
						},

						visibilidad: json.settings.visibilidad || {},

						// APLICAMOS EL MERGE CORRECTO
						avanzado: mergedAdv,
					}));
				}
			} catch (e) {
				console.error('Error cargando settings globales:', e);
			}
		}

		loadAllSettings();
	}, []);

	// =======================================
	// FUNCIÓN PARA ACTUALIZAR CUALQUIER SECCIÓN
	// =======================================
	const updateSettings = (section, values) => {
		setGlobalSettings((prev) => {
			if (section === 'phone' || section === 'icon' || section === 'floating') {
				return {
					...prev,
					general: {
						...prev.general,
						[section]: {
							...prev.general[section],
							...values,
						},
					},
				};
			}

			return {
				...prev,
				[section]: {
					...prev[section],
					...values,
				},
			};
		});
	};

	// ============================
	// RENDER DE CADA TAB
	// ============================
	const renderTab = () => {
		const sharedProps = {
			globalSettings,
			updateSettings,
		};

		switch (activeTab) {
			case 'general':
				return <GeneralTab {...sharedProps} />;

			case 'visibilidad':
				return (
					<VisibilidadTab
						settings={globalSettings.visibilidad}
						onChange={(data) => updateSettings('visibilidad', data)}
					/>
				);

			case 'avanzado':
				return (
					<AvanzadoTab
						globalSettings={globalSettings}
						updateSettings={updateSettings}
					/>
				);

			case 'premium':
				return <PremiumTab {...sharedProps} />;

			default:
				return <GeneralTab {...sharedProps} />;
		}
	};

	return (
		<div className="jlc-dashboard">
			<div className="jlc-wa-adminbar">
				<Header />
			</div>

			<div className="jlc-dasboard__main">
				<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

				<main className="jlc-content">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial="hidden"
							animate="show"
							exit={{ opacity: 0, y: -10 }}
							variants={fadeInUp}
							className="jlc-container-tabs"
						>
							{renderTab()}
						</motion.div>
					</AnimatePresence>
				</main>
			</div>
		</div>
	);
}
