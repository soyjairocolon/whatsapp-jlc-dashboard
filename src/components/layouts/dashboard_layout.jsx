export default function DashboardLayout({ sidebar, children }) {
	return (
		<div className="jlc-dashboard">
			<aside className="jlc-sidebar">{sidebar}</aside>

			<main className="jlc-content">{children}</main>
		</div>
	);
}
