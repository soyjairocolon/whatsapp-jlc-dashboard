import './sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
	return (
		<aside className="jlc-sidebar">

			<nav className="jlc-nav">
				<button
					className={`jlc-nav-item ${
						activeTab === 'general' ? 'jlc-active' : ''
					}`}
					onClick={() => setActiveTab('general')}
				>
					General
				</button>

				<button
					className={`jlc-nav-item ${
						activeTab === 'estilos' ? 'jlc-active' : ''
					}`}
					onClick={() => setActiveTab('estilos')}
				>
					Estilos
				</button>

				<button
					className={`jlc-nav-item ${
						activeTab === 'visibilidad' ? 'jlc-active' : ''
					}`}
					onClick={() => setActiveTab('visibilidad')}
				>
					Visibilidad
				</button>

				<button
					className={`jlc-nav-item ${
						activeTab === 'avanzado' ? 'jlc-active' : ''
					}`}
					onClick={() => setActiveTab('avanzado')}
				>
					Avanzado
				</button>

				<button
					className={`jlc-nav-item ${
						activeTab === 'premium' ? 'jlc-active' : ''
					}`}
					onClick={() => setActiveTab('premium')}
				>
					Premium ⭐
				</button>
			</nav>
		</aside>
	);
}
