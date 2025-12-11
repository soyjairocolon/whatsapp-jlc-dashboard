import { useEffect } from 'react';
import './floating_button_options.css';

export default function FloatingButtonOptions({ settings = {}, onChange }) {
	const defaultSettings = {
		showTooltip: true,
		tooltipText: '¿Necesitas ayuda?',
		tooltipInterval: 8,
		position: 'right',
		animationType: 'none',
		delay: 1,
		mobileOnly: false,
		showQR: false,
		openWeb: false,
	};

	// Normalización de settings
	const normalized = {
		...defaultSettings,
		...(settings || {}),
		tooltipInterval:
			settings.tooltipInterval === 0 && settings.showTooltip !== false
				? defaultSettings.tooltipInterval
				: settings.tooltipInterval ?? defaultSettings.tooltipInterval,
	};

	// Inicializar solo una vez
	useEffect(() => {
		onChange(normalized);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateField = (field, value) => {
		let updated = {
			...normalized,
			[field]: value,
		};

		// Si el usuario oculta el tooltip → limpiar valores
		if (field === 'showTooltip') {
			if (value === false) {
				updated.tooltipText = '';
				updated.tooltipInterval = 0;
			} else {
				if (!updated.tooltipText)
					updated.tooltipText = defaultSettings.tooltipText;
				if (!updated.tooltipInterval || updated.tooltipInterval === 0) {
					updated.tooltipInterval = defaultSettings.tooltipInterval;
				}
			}
		}

		onChange(updated);
	};

	return (
		<div className="jlc-floating-options">
			<h2 className="jlc-floating-section-title">
				Opciones del Botón Flotante
			</h2>

			{/* NUEVO: Mostrar/Ocultar tooltip */}
			<div className="jlc-floating-field">
				<label className="jlc-floating-label">
					¿Mostrar burbuja de información emergente?
				</label>

				<div className="jlc-floating-radio-group">
					<label className="jlc-floating-radio">
						<input
							type="radio"
							checked={normalized.showTooltip === true}
							onChange={() => updateField('showTooltip', true)}
						/>
						Sí
					</label>

					<label className="jlc-floating-radio">
						<input
							type="radio"
							checked={normalized.showTooltip === false}
							onChange={() => updateField('showTooltip', false)}
						/>
						No
					</label>
				</div>
			</div>

			{/* Tooltip — solo si está activado */}
			{normalized.showTooltip && (
				<>
					<div className="jlc-floating-field">
						<label className="jlc-floating-label">Información emergente</label>

						<input
							type="text"
							className="jlc-floating-input"
							placeholder="¿Necesitas ayuda?"
							value={normalized.tooltipText}
							onChange={(e) => updateField('tooltipText', e.target.value)}
						/>

						<p className="jlc-floating-description">
							Texto breve que se muestra junto al botón
						</p>
					</div>

					{/* Intervalo Tooltip */}
					<div className="jlc-floating-field">
						<label className="jlc-floating-label">
							Intervalo de la información emergente
						</label>

						<div className="jlc-floating-delay-field">
							<input
								type="number"
								min={3}
								className="jlc-floating-input-number"
								value={normalized.tooltipInterval}
								onChange={(e) =>
									updateField('tooltipInterval', Number(e.target.value))
								}
							/>
							<span className="jlc-floating-delay-suffix">segundos</span>
						</div>

						<p className="jlc-floating-description">
							Frecuencia con la que aparece automáticamente la información
							emergente.
						</p>
					</div>
				</>
			)}

			{/* Posición */}
			<div className="jlc-floating-field">
				<label className="jlc-floating-label">Posición en pantalla</label>

				<div className="jlc-floating-radio-group">
					<label className="jlc-floating-radio">
						<input
							type="radio"
							checked={normalized.position === 'left'}
							onChange={() => updateField('position', 'left')}
						/>
						Izquierda
					</label>

					<label className="jlc-floating-radio">
						<input
							type="radio"
							checked={normalized.position === 'right'}
							onChange={() => updateField('position', 'right')}
						/>
						Derecha
					</label>
				</div>
			</div>

			{/* Tipo de animación */}
			<div className="jlc-floating-field">
				<label className="jlc-floating-label">Tipo de animación</label>

				<div className="jlc-floating-select-wrapper">
					<select
						className="jlc-floating-select"
						value={normalized.animationType}
						onChange={(e) => updateField('animationType', e.target.value)}
					>
						<option value="none">Sin animación</option>
						<option value="pulse">Pulso</option>
						<option value="vibrate">Vibración</option>
					</select>
				</div>
			</div>

			{/* Retardo */}
			<div className="jlc-floating-field">
				<label className="jlc-floating-label">Retardo del botón</label>

				<div className="jlc-floating-delay-field">
					<input
						type="number"
						min={-1}
						className="jlc-floating-input-number"
						value={normalized.delay}
						onChange={(e) => updateField('delay', Number(e.target.value))}
					/>
					<span className="jlc-floating-delay-suffix">segundos</span>
				</div>

				<p className="jlc-floating-description">
					-1 para mostrar directamente sin animación
				</p>
			</div>

			{/* Solo móvil */}
			<div className="jlc-floating-field">
				<label className="jlc-floating-checkbox">
					<input
						type="checkbox"
						checked={normalized.mobileOnly}
						onChange={(e) => updateField('mobileOnly', e.target.checked)}
					/>
					Solo mostrar el botón en móviles
				</label>
			</div>

			{/* Opciones de escritorio */}
			<div className="jlc-floating-field jlc-floating-field--group_box">
				<label className="jlc-floating-checkbox">
					<input
						type="checkbox"
						checked={normalized.showQR}
						onChange={(e) => updateField('showQR', e.target.checked)}
					/>
					Mostrar código QR para escanear con el móvil
				</label>

				<label className="jlc-floating-checkbox">
					<input
						type="checkbox"
						checked={normalized.openWeb}
						onChange={(e) => updateField('openWeb', e.target.checked)}
					/>
					Abrir directamente WhatsApp Web
				</label>
			</div>
		</div>
	);
}
