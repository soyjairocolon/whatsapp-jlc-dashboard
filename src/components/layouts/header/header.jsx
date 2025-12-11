import logoDesktop from '../../../assets/images/logo/whatsapp_jlc--desktop.png';
import logoMobile from '../../../assets/images/logo/whatsapp_jlc--mobile.png';
import './header.css';

export default function Header() {
	const isDev = import.meta.env.DEV;

	let desktopLogo;
	let mobileLogo;

	if (isDev) {
		desktopLogo = logoDesktop;
		mobileLogo = logoMobile;
	} else {
		const base = window.wjlcData?.pluginUrl || '';
		desktopLogo = `${base}admin-panel/build/whatsapp_jlc--desktop.png`;
		mobileLogo = `${base}admin-panel/build/whatsapp_jlc--mobile.png`;
	}

	return (
		<div className="jlc-wa-header">
			<div className="jlc-wa-header-left">
				<img
					src={desktopLogo}
					alt="WhatsApp JLC"
					className="jlc-wa-logo-desktop"
				/>

				<img
					src={mobileLogo}
					alt="WhatsApp JLC"
					className="jlc-wa-logo-mobile"
				/>
			</div>

			<div className="jlc-wa-header-right">
				<a
					href="https://jairocolon.com"
					target="_blank"
					className="jlc-wa-header-link"
				>
					Documentación
				</a>
				<a
					href="https://jairocolon.com"
					target="_blank"
					className="jlc-wa-header-link"
				>
					Soporte
				</a>
				<a
					href="https://jairocolon.com"
					target="_blank"
					className="jlc-wa-header-premium--btn"
				>
					Premium
				</a>
			</div>
		</div>
	);
}
