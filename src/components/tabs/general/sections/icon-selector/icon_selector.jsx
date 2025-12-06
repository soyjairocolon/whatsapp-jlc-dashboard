import { useEffect, useState } from 'react';
import IconImagePicker from './icon-image-picker/icon_image_picker';
import iconFree1 from '../../../../../assets/icons/free/free-1-icon-ws.png';
import iconFree2 from '../../../../../assets/icons/free/free-2-icon-ws.png';
import iconFree3 from '../../../../../assets/icons/free/free-3-icon-ws.webp';
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
		{ id: 'default_whatsapp', src: iconFree1 },
		{ id: 'default_chat', src: iconFree2 },
		{ id: 'default_support', src: iconFree3 },
	];

	const premiumIcons = [
		{ id: 'premium_1', label: 'WhatsApp Pro', src: '/icons/premium1.png' },
		{ id: 'premium_2', label: 'Chat Pro', src: '/icons/premium2.png' },
	];

	// ==========================================================
	//  1. CUANDO CAMBIEN SETTINGS DESDE WORDPRESS → CARGARLOS
	// ==========================================================
	// ===============================
	//  1. Cargar settings desde WP
	// ===============================
	useEffect(() => {
		if (!settings) return;

		// Agrupamos actualizaciones → evita cascadas
		setSelectedIcon(settings.selected_icon || 'default_whatsapp');
		setCustomImage(settings.custom_image || '');
		setBehavior(settings.behavior || 'toggle');
		setColor(settings.color || '#25D366');
		setPremiumUnlocked(settings.premium_unlocked || false);
	}, [settings]);

	// ===============================================
	//  2. Notificar cambios al componente padre
	// ===============================================
	useEffect(() => {
		onChange({
			selected_icon: selectedIcon,
			custom_image: customImage,
			behavior,
			color,
			premium_unlocked: premiumUnlocked,
		});

		// ⚠️ Se IGNORA onChange en dependencias, porque
		// causaría un loop al recrearse en cada render.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedIcon, customImage, behavior, color, premiumUnlocked]);

	// ==========================================================
	//  3. CAMBIO DE ICONO (free o premium)
	// ==========================================================
	const handleIconChange = (id, isPremium) => {
		if (isPremium && !premiumUnlocked) return; 
		setSelectedIcon(id);
		setCustomImage(''); 
	};

	return (
		<div className="jlc-icon-selector">
			<h2 className="jlc-section-title">Icono del Botón Flotante</h2>

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
