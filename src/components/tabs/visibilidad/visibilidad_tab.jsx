/* global wjlcData */
import { useState, useEffect } from 'react';
import { notifySuccess, toastError } from '../../../utils/notifications';
import './visibilidad_tab.css';

export default function VisibilidadTab({ settings = {}, onChange }) {
	const defaultVisibility = {
		global: 'show',
		home: 'inherit',
		blog: 'inherit',
		notFound: 'inherit',
		search: 'inherit',

		archive: 'inherit',
		archive_date: 'inherit',
		archive_author: 'inherit',

		singular: 'inherit',
		page: 'inherit',
		post: 'inherit',
	};

	const [visibility, setVisibility] = useState(defaultVisibility);

	// CARGA INICIAL
	useEffect(() => {
		setVisibility({
			...defaultVisibility,
			...(settings || {}),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	// ACTUALIZA ESTADO INTERNO Y DASHBOARD
	const updateField = (field, value) => {
		const updated = { ...visibility, [field]: value };
		setVisibility(updated);
		onChange(updated);
	};

	// REINICIAR VISIBILIDAD
	const restoreDefaults = async () => {
		const restored = { ...defaultVisibility };

		setVisibility(restored);
		onChange(restored);

		// AUTO-GUARDADO
		try {
			const res = await fetch('/wp-json/wjlc/v1/save-visibility-settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': wjlcData.nonce,
				},
				body: JSON.stringify({ visibilidad: restored }),
			});

			const json = await res.json();

			if (json.success) {
				notifySuccess('Visibilidad restaurada y guardada');
			} else {
				toastError('No se pudo guardar');
			}
		} catch (error) {
			console.error('❌ Error:', error);
			toastError('Error al guardar');
		}
	};

	// DIBUJA CADA FILA
	const renderRow = (label, field, isChild = false) => {
		const isGlobal = field === 'global';

		return (
			<div
				className={`jlc-vis-row 
					${isChild ? 'jlc-vis-child' : ''} 
					${isGlobal ? 'jlc-vis-global' : ''}
				`}
			>
				<div className="jlc-vis-label">{label}</div>

				<div className="jlc-vis-actions">
					{/* GLOBAL: SOLO MOSTRAR / OCULTAR */}
					{!isGlobal && (
						<button
							className={`jlc-vis-btn ${
								visibility[field] === 'inherit' ? 'active inherit' : ''
							}`}
							onClick={() => updateField(field, 'inherit')}
						>
							👁‍🗨 Heredar de global
						</button>
					)}

					<button
						className={`jlc-vis-btn ${
							visibility[field] === 'show' ? 'active show' : ''
						}`}
						onClick={() => updateField(field, 'show')}
					>
						👁 Mostrar
					</button>

					<button
						className={`jlc-vis-btn ${
							visibility[field] === 'hide' ? 'active hide' : ''
						}`}
						onClick={() => updateField(field, 'hide')}
					>
						🚫 Ocultar
					</button>
				</div>
			</div>
		);
	};

	// GUARDAR CAMBIOS EN BACKEND
	const saveVisibilitySettings = async () => {
		const payload = { visibilidad: visibility };

		try {
			const res = await fetch('/wp-json/wjlc/v1/save-visibility-settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': wjlcData.nonce,
				},
				body: JSON.stringify(payload),
			});

			const json = await res.json();

			if (!res.ok || !json.success) throw new Error();

			notifySuccess('Cambios guardados correctamente');
		} catch (error) {
			console.error('❌ Error:', error);
			toastError('No se pudieron guardar los cambios');
		}
	};

	return (
		<div className="jlc-vis-page">
			<h1 className="jlc-page-title">Visibilidad</h1>

			<p className="jlc-page-subtitle">
				Desde aquí puedes configurar en qué páginas será visible el botón
				flotante.
				<button className="jlc-vis-restore-btn" onClick={restoreDefaults}>
					<span className="jlc-vis-restore-icon">↻</span>
					Restaurar visibilidad por defecto
				</button>
			</p>

			<div className="jlc-sections-visibility-wrapper">
				{renderRow('Global', 'global')}
				{renderRow('Página de inicio', 'home')}
				{renderRow('Página del blog', 'blog')}
				{renderRow('Página 404', 'notFound')}
				{renderRow('Resultados de búsqueda', 'search')}
				{renderRow('Archivo', 'archive')}

				{renderRow('Archivos por fecha', 'archive_date', true)}
				{renderRow('Archivos de autor', 'archive_author', true)}

				{renderRow('Simple', 'singular')}
				{renderRow('Página', 'page', true)}
				{renderRow('Entrada', 'post', true)}

				<button
					className="jlc-save-btn jlc-btn-primary"
					onClick={saveVisibilitySettings}
				>
					Guardar cambios
				</button>
			</div>
		</div>
	);
}
