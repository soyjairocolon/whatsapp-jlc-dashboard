import './index.css';

export default function App() {
	return (
		<div className="jlc-dashboard">
			<aside className="jlc-sidebar">
				<h2 className="jlc-sidebar-title">WhatsApp JLC</h2>

				<nav className="jlc-nav">
					<button className="jlc-nav-item jlc-active">General</button>
					<button className="jlc-nav-item">Estilos</button>
					<button className="jlc-nav-item">Avanzado</button>
				</nav>
			</aside>

			<main className="jlc-content">
				<h1 className="jlc-page-title">Configuración General</h1>

				<div className="jlc-card">
					<label className="jlc-label">Número de WhatsApp</label>
					<input
						className="jlc-input"
						type="text"
						placeholder="+57 300 000 0000"
					/>

					<label className="jlc-label">Mensaje inicial</label>
					<textarea
						className="jlc-textarea"
						placeholder="Hola, quisiera más información..."
					></textarea>

					<button className="jlc-btn-primary">Guardar cambios</button>
				</div>
			</main>
		</div>
	);
}
