import CustomCSSSection from './sections/custom-css/custom_css_section';
import './avanzado_tab.css';

export default function AvanzadoTab({ globalSettings, updateSettings }) {
	return (
		<section className="jlc-advanced-page">
			<h1 className="jlc-page-title">Ajustes avanzados</h1>

			<div className="jlc-advanced-container">
				<div className="jlc-advanced-card">
					<CustomCSSSection
						settings={globalSettings.advanced || {}}
						onChange={(updated) => updateSettings('advanced', updated)}
					/>

					<button className="jlc-btn-primary">Guardar cambios</button>
				</div>
			</div>
		</section>
	);
}
