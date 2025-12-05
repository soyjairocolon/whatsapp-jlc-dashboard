import { useState } from 'react';
import DashboardLayout from '../components/layouts/dashboard_layout';
import GeneralTab from '../components/tabs/general_tab';
import EstilosTab from '../components/tabs/estilos_tab';
import AvanzadoTab from '../components/tabs/avanzado_tab';

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('general');

	const renderContent = () => {
		switch (activeTab) {
			case 'general':
				return <GeneralTab />;
			case 'estilos':
				return <EstilosTab />;
			case 'avanzado':
				return <AvanzadoTab />;
			default:
				return <GeneralTab />;
		}
	};

	const sidebar = (
		<>
			<h2 className="jlc-sidebar-title">WhatsApp JLC</h2>

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
						activeTab === 'avanzado' ? 'jlc-active' : ''
					}`}
					onClick={() => setActiveTab('avanzado')}
				>
					Avanzado
				</button>
			</nav>
		</>
	);

	return <DashboardLayout sidebar={sidebar}>{renderContent()}</DashboardLayout>;
}
