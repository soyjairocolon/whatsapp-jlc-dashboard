import { useEffect, useState } from 'react';
import IconImagePicker from './icon-image-picker/icon_image_picker';
import iconDefaultWS from '../../../../../assets/images/icons/free/default_whatsapp.png'
import iconDefaultChat from '../../../../../assets/images/icons/free/default_chat.png';
import iconDefaultSupport from '../../../../../assets/images/icons/free/default_support.png';
import iconPremium1 from '../../../../../assets/images/icons/premium/premium_1.jpg';
import iconPremium2 from '../../../../../assets/images/icons/premium/premium_2.png';
import './icon_selector.css';

export default function IconSelector({ settings = {}, onChange }) {
	// ===============================
	//  ESTADO LOCAL
	// ===============================
	const [selectedIcon, setSelectedIcon] = useState('default_whatsapp');
	const [customImage, setCustomImage] = useState('');
	const [behavior, setBehavior] = useState('toggle');
	const [color, setColor] = useState('#25D366');
	const [premiumUnlocked, setPremiumUnlocked] = useState(false);

	// ===============================
	//  ÍCONOS
	// ===============================
	const freeIcons = [
		{ id: 'default_whatsapp', src: iconDefaultWS },
		{ id: 'default_chat', src: iconDefaultChat },
		{ id: 'default_support', src: iconDefaultSupport },
	];

	const premiumIcons = [
		{ id: 'premium_1', label: 'WhatsApp Pro', src: iconPremium1 },
		{ id: 'premium_2', label: 'Chat Pro', src: iconPremium2 },
	];

	// ==========================================================
	//  1. CUANDO CAMBIEN SETTINGS DESDE WORDPRESS → CARGARLOS
	// ==========================================================
	useEffect(() => {
		if (!settings) return;

		setSelectedIcon(settings.selected_icon || 'default_whatsapp');
		setCustomImage(settings.custom_image || '');
		setBehavior(settings.behavior || 'toggle');
		setColor(settings.color || '#25D366');
		setPremiumUnlocked(settings.premium_unlocked || false);
	}, [settings]);

	// ==========================================================
	//  2. NOTIFICAR CAMBIOS AL COMPONENTE PADRE (GeneralTab)
	// ==========================================================
	useEffect(() => {
		onChange({
			selected_icon: selectedIcon,
			custom_image: customImage,
			behavior,
			color,
			premium_unlocked: premiumUnlocked,
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedIcon, customImage, behavior, color, premiumUnlocked]);

	// ==========================================================
	//  3. CAMBIO DE ICON (free o premium)
	// ==========================================================
	const handleIconChange = (id, isPremium) => {
		if (isPremium && !premiumUnlocked) return;

		setSelectedIcon(id);
		setCustomImage(''); // Si elige un icon, eliminamos el custom_image
	};

	return (
		<div className="jlc-icon-selector">
			<h2 className="jlc-section-title">Icon del Botón Flotante</h2>

			<p className="jlc-section-description">
				Selecciona el estilo visual principal del botón de contacto.
			</p>

			{/* Íconos FREE */}
			<div className="jlc-icon-grid">
				{freeIcons.map((icon) => (
					<div
						key={icon.id}
						className={`jlc-icon-item ${
							selectedIcon === icon.id ? 'jlc-icon-active' : ''
						}`}
						onClick={() => handleIconChange(icon.id, false)}
					>
						<img src={icon.src} alt={icon.id} />
					</div>
				))}
			</div>

			{/* Íconos PREMIUM */}
			<div className="jlc-icon-premium-grid">
				{premiumIcons.map((icon) => {
					const locked = !premiumUnlocked;

					return (
						<div
							key={icon.id}
							className={`jlc-icon-item jlc-icon-premium ${
								locked ? 'jlc-locked' : ''
							}`}
							onClick={() => handleIconChange(icon.id, true)}
						>
							<img src={icon.src} alt={icon.label} />

							{locked && (
								<div className="jlc-lock">
									<span>🔒 Premium</span>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Imagen personalizada */}
			<div className="jlc-custom-image-box">
				<label className="jlc-label">Imagen personalizada</label>

				<div className="jlc-custom-image-row">
					{customImage && (
						<img
							src={customImage}
							alt="Vista previa"
							className="jlc-custom-image-preview"
						/>
					)}

					<IconImagePicker
						value={customImage}
						onChange={(url) => {
							setCustomImage(url);
							setSelectedIcon('custom_image');
						}}
						buttonClass="jlc-btn-linear"
					/>

					{customImage && (
						<button
							className="jlc-btn-delete"
							onClick={() => {
								setCustomImage('');
								setSelectedIcon('default_whatsapp');
							}}
						>
							Eliminar
						</button>
					)}
				</div>
			</div>

			{/* BEHAVIOR */}
			<div className="jlc-radio-group">
				<label>
					<input
						type="radio"
						value="toggle"
						checked={behavior === 'toggle'}
						onChange={(e) => setBehavior(e.target.value)}
					/>
					<span>Alternar con el ícono</span>
				</label>

				<label>
					<input
						type="radio"
						value="fixed"
						checked={behavior === 'fixed'}
						onChange={(e) => setBehavior(e.target.value)}
					/>
					<span>Imagen fija</span>
				</label>
			</div>

			{/* COLOR PICKER */}
			<div className="jlc-color-box">
				<label className="jlc-label">Selecciona el color del botón</label>

				<input
					type="color"
					className="jlc-color-picker"
					value={color}
					onChange={(e) => setColor(e.target.value)}
				/>
			</div>
		</div>
	);
}
