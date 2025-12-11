import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import { toastError } from '../../../../../utils/notifications';
import './phone_settings.css';

export default function PhoneSettings({ settings = {}, onChange }) {
	const defaultMessage = 'Hola, necesito más información sobre:';
	const [phone, setPhone] = useState(settings.phone || '');
	const [initialMessage, setInitialMessage] = useState(
		settings.initialMessage || defaultMessage
	);

	useEffect(() => {
		if (!settings) return;

		const newPhone = settings.phone ?? '';
		const newMsg = settings.initialMessage ?? defaultMessage;

		if (phone !== newPhone) setPhone(newPhone);
		if (initialMessage !== newMsg) setInitialMessage(newMsg);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	// ENVIAR DATOS AL PADRE SOLO CUANDO EL USUARIO CAMBIA
	const handlePhoneChange = (value) => {
		setPhone(value);
		onChange({
			phone: value,
			initialMessage,
		});
	};

	const handleInitialMessageChange = (value) => {
		setInitialMessage(value);
		onChange({
			phone,
			initialMessage: value,
		});
	};

	// PROBAR NÚMERO
	const testNumber = () => {
		if (!phone) return toastError('Por favor ingresa un número válido');

		const encodedMsg = encodeURIComponent(initialMessage);
		const url = `https://wa.me/${phone}?text=${encodedMsg}`;
		window.open(url, '_blank');
	};

	return (
		<div className="jlc-phone-settings">
			<p className="jlc-section-description">
				Establece el número de contacto y el aspecto del botón flotante.
			</p>

			<h2 className="jlc-section-title">Número y Mensaje Inicial</h2>

			<label className="jlc-label">Número de WhatsApp</label>

			<div className="jlc-phone-row">
				<PhoneInput
					country="co"
					value={phone}
					onChange={handlePhoneChange}
					enableSearch
					placeholder="+57 300 000 0000"
					inputClass="jlc-phone-input"
					buttonClass="jlc-phone-flag"
					containerClass="jlc-phone-container"
				/>

				<button className="jlc-btn-secondary" onClick={testNumber}>
					Probar número
				</button>
			</div>

			<p className="jlc-helper">
				El botón no se mostrará si no hay número de WhatsApp configurado.
			</p>

			<label className="jlc-label">Mensaje inicial</label>

			<textarea
				className="jlc-textarea"
				value={initialMessage}
				onChange={(e) => handleInitialMessageChange(e.target.value)}
			/>

			<p className="jlc-helper">
				Mensaje que el usuario enviará al iniciar la conversación.
			</p>
		</div>
	);
}
