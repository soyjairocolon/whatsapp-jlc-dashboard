/* global wjlcData */
import { useState, useEffect, useRef } from 'react';
import './floating_button_options.css';

export default function FloatingButtonOptions({ onChange }) {
	const [tooltipText, setTooltipText] = useState('');
	const [position, setPosition] = useState('right');
	const [delay, setDelay] = useState(1);
	const [mobileOnly, setMobileOnly] = useState(false);
	const [animationType, setAnimationType] = useState('none');
	const [tooltipInterval, setTooltipInterval] = useState(8);
	const [showQR, setShowQR] = useState(false);
	const [openWeb, setOpenWeb] = useState(false);

	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		async function loadFloatingSettings() {
			try {
				const res = await fetch('/wp-json/wjlc/v1/general-settings', {
					method: 'GET',
					headers: {
						'X-WP-Nonce': wjlcData.nonce,
					},
				});

				if (!res.ok) throw new Error('Error cargando settings');

				const json = await res.json();
				const data = json.settings?.floating || {};

				const tooltip = data.tooltipText ?? '¿Necesitas ayuda?';
				const pos = data.position ?? 'right';
				const anim = data.animationType ?? 'none';
				const d = data.delay ?? 1;
				const mobile = data.mobileOnly ?? false;
				const showQrVal = data.showQR ?? false;
				const openWebVal = data.openWeb ?? false;

				setTooltipText(tooltip);
				setPosition(pos);
				setAnimationType(anim);
				setDelay(d);
				setMobileOnly(mobile);
				setShowQR(showQrVal);
				setOpenWeb(openWebVal);

				onChange({
					tooltipText: tooltip,
					position: pos,
					delay: d,
					mobileOnly: mobile,
				});
			} catch (e) {
				console.error('Floating settings error:', e);
			}
		}

		loadFloatingSettings();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * 2) Enviar cambios al padre
	 */
	useEffect(() => {
		onChangeRef.current({
			tooltipText: tooltipText || '¿Necesitas ayuda?',
			tooltipInterval,
			position,
			animationType,
			delay,
			mobileOnly,
			showQR,
			openWeb,
		});
	}, [
		tooltipText,
		position,
		delay,
		mobileOnly,
		animationType,
		tooltipInterval,
		showQR,
		openWeb,
	]);

	return (
		<div className="jlc-floating-options">
			<h2 className="jlc-section-title">Opciones del Botón Flotante</h2>

			{/* Tooltip */}
			<div className="jlc-field">
				<label className="jlc-label">Información emergente</label>

				<input
					type="text"
					className="jlc-input"
					placeholder="¿Necesitas ayuda?"
					value={tooltipText}
					onChange={(e) => setTooltipText(e.target.value)}
				/>

				<p className="jlc-description">
					Texto breve que se muestra junto al botón
				</p>
			</div>
			<div className="jlc-field">
				<label className="jlc-label">
					Intervalo de la información emergente
				</label>

				<div className="jlc-delay-field">
					<input
						type="number"
						min={3}
						className="jlc-input-number"
						value={tooltipInterval}
						onChange={(e) => setTooltipInterval(Number(e.target.value))}
					/>
					<span className="jlc-delay-suffix">segundos</span>
				</div>

				<p className="jlc-description">
					Frecuencia con la que aparece automáticamente el información
					emergente.
				</p>
			</div>

			{/* Posición */}
			<div className="jlc-field">
				<label className="jlc-label">Posición en pantalla</label>

				<div className="jlc-radio-group">
					<label className="jlc-radio">
						<input
							type="radio"
							checked={position === 'left'}
							onChange={() => setPosition('left')}
						/>
						Izquierda
					</label>

					<label className="jlc-radio">
						<input
							type="radio"
							checked={position === 'right'}
							onChange={() => setPosition('right')}
						/>
						Derecha
					</label>
				</div>
			</div>

			<div className="jlc-field">
				<label className="jlc-label">Tipo de animación</label>

				<div className="jlc-select-wrapper">
					<select
						className="jlc-select"
						value={animationType}
						onChange={(e) => setAnimationType(e.target.value)}
					>
						<option value="none">Sin animación</option>
						<option value="pulse">Pulso</option>
						<option value="vibrate">Vibración</option>
					</select>
				</div>
			</div>

			{/* Retardo */}
			<div className="jlc-field">
				<label className="jlc-label">Retardo del botón</label>

				<div className="jlc-delay-field">
					<input
						type="number"
						min={-1}
						className="jlc-input-number"
						value={delay}
						onChange={(e) => setDelay(Number(e.target.value))}
					/>
					<span className="jlc-delay-suffix">segundos</span>
				</div>

				<p className="jlc-description">
					-1 para mostrar directamente sin animación
				</p>
			</div>

			{/* Solo móvil */}
			<div className="jlc-field">
				<label className="jlc-checkbox">
					<input
						type="checkbox"
						checked={mobileOnly}
						onChange={(e) => setMobileOnly(e.target.checked)}
					/>
					Solo mostrar el botón en móviles
				</label>
			</div>

			{/* OPCIONES DE ESCRITORIO */}
			<div className="jlc-field">
				<label className="jlc-checkbox">
					<input
						type="checkbox"
						checked={showQR}
						onChange={(e) => setShowQR(e.target.checked)}
					/>
					Mostrar código QR para escanear con el móvil
				</label>

				<label className="jlc-checkbox">
					<input
						type="checkbox"
						checked={openWeb}
						onChange={(e) => setOpenWeb(e.target.checked)}
					/>
					Abrir directamente WhatsApp Web
				</label>
			</div>
		</div>
	);
}
