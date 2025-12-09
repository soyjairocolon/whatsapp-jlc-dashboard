import { useState } from 'react';
import Sidebar from '../../components/layouts/dasboard/sidebar/sidebar';
import Content from '../../components/layouts/dasboard/content/content';
import GeneralTab from '../../components/tabs/general/general_tab';
import EstilosTab from '../../components/tabs/estilos/estilos_tab';
import VisibilidadTab from '../../components/tabs/visibilidad/visibilidad_tab';
import AvanzadoTab from '../../components/tabs/avanzado/avanzado_tab';
import PremiumTab from '../../components/tabs/premium/premium_tab';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeInUp } from '../../motion/variants';
import Header from '../../components/layouts/header/header';
import './dashboard.css';

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('general');

	const renderTab = () => {
		switch (activeTab) {
			case 'general':
				return <GeneralTab />;
			case 'estilos':
				return <EstilosTab />;
			case 'visibilidad':
				return <VisibilidadTab />;
			case 'avanzado':
				return <AvanzadoTab />;
			case 'premium':
				return <PremiumTab />;
			default:
				return <GeneralTab />;
		}
	};

	return (
		<div className="jlc-dashboard">
			<div className='jlc-wa-adminbar'>
				<Header />
			</div>
			<div className="jlc-dasboard__main">
				<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
				<main className="jlc-content">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial="hidden"
							animate="show"
							exit={{ opacity: 0, y: -10 }}
							variants={fadeInUp}
							className='jlc-container-tabs'
						>
							{renderTab()}
						</motion.div>
					</AnimatePresence>
				</main>
			</div>
		</div>
	);
}
