// /* global wjlcData */
import { useEffect, useState } from 'react';
import IconImagePicker from './icon-image-picker/icon_image_picker';
import iconDefaultWSDev from '../../../../../assets/images/icons/free/default_whatsapp.png';
import iconDefaultChatDev from '../../../../../assets/images/icons/free/default_chat.png';
import iconDefaultSupportDev from '../../../../../assets/images/icons/free/default_support.png';
import iconPremium1Dev from '../../../../../assets/images/icons/premium/premium_1.jpg';
import iconPremium2Dev from '../../../../../assets/images/icons/premium/premium_2.png';
import './icon_selector.css';

export default function IconSelector({ settings = {}, onChange }) {
	const isDev = import.meta.env.DEV;
	const [selectedIcon, setSelectedIcon] = useState('default_whatsapp');
	const [customImage, setCustomImage] = useState('');
	const [behavior, setBehavior] = useState('toggle');
	const [color, setColor] = useState('#25D366');
	const [premiumUnlocked, setPremiumUnlocked] = useState(false);
	const [isReady, setIsReady] = useState(false);

	let freeIcons;
	let premiumIcons;

	if (isDev) {
		freeIcons = [
			{ id: 'default_whatsapp', src: iconDefaultWSDev },
			{ id: 'default_chat', src: iconDefaultChatDev },
			{ id: 'default_support', src: iconDefaultSupportDev },
		];

		premiumIcons = [
			{ id: 'premium_1', label: 'WhatsApp Pro', src: iconPremium1Dev },
			{ id: 'premium_2', label: 'Chat Pro', src: iconPremium2Dev },
		];
	} else {
		const base = window.wjlcData?.pluginUrl + 'assets/images/icons/';

		freeIcons = [
			{ id: 'default_whatsapp', src: `${base}free/default_whatsapp.png` },
			{ id: 'default_chat', src: `${base}free/default_chat.png` },
			{ id: 'default_support', src: `${base}free/default_support.png` },
		];

		premiumIcons = [
			{
				id: 'premium_1',
				label: 'WhatsApp Pro',
				src: `${base}premium/premium_1.jpg`,
			},
			{
				id: 'premium_2',
				label: 'Chat Pro',
				src: `${base}premium/premium_2.png`,
			},
		];
	}

	// CUANDO CAMBIEN SETTINGS DESDE WORDPRESS → CARGARLOS
	useEffect(() => {
		if (!settings) return;

		setSelectedIcon(settings.selected_icon || 'default_whatsapp');
		setCustomImage(settings.custom_image || '');
		setBehavior(settings.behavior || 'toggle');
		setColor(settings.color || '#25D366');
		setPremiumUnlocked(settings.premium_unlocked || false);

		setIsReady(true);
	}, [settings]);

	// NOTIFICAR CAMBIOS AL COMPONENTE PADRE (GeneralTab)
	useEffect(() => {
		if (!isReady) return;

		onChange({
			selected_icon: selectedIcon,
			custom_image: customImage,
			behavior,
			color,
			premium_unlocked: premiumUnlocked,
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedIcon, customImage, behavior, color, premiumUnlocked, isReady]);

	const handleIconChange = (id, isPremium) => {
		if (isPremium && !premiumUnlocked) return;

		setSelectedIcon(id);
		setCustomImage('');
	};

	const handleBehaviorChange = (value) => {
		setBehavior(value);

		if (value === 'fixed' && !customImage) {
			setSelectedIcon('custom_image');
		}
	};

	return (
		<div className="jlc-icon-selector">
			<h2 className="jlc-section-title">Icon del Botón Flotante</h2>

			<p className="jlc-section-description">
				Selecciona el estilo visual principal del botón de contacto.
			</p>

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

			<div className="jlc-radio-group">
				<label>
					<input
						type="radio"
						value="toggle"
						checked={behavior === 'toggle'}
						onChange={(e) => handleBehaviorChange(e.target.value)}
					/>
					<span>Alternar con el ícono</span>
				</label>

				<label>
					<input
						type="radio"
						value="fixed"
						className={!customImage ? 'jlc-radio-disabled' : ''}
						disabled={!customImage}
						checked={behavior === 'fixed'}
						onChange={(e) => handleBehaviorChange(e.target.value)}
					/>

					<span>Imagen fija</span>
				</label>
			</div>

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
