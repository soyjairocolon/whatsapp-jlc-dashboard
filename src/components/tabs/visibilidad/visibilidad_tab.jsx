import { useState, useEffect } from "react";
import "./visibilidad_tab.css";

export default function VisibilidadTab({ settings = {}, onChange }) {
	const defaultVisibility = {
		global: "inherit",
		home: "inherit",
		blog: "inherit",
		notFound: "inherit",
		search: "inherit",

		archive: "inherit",
		archive_date: "inherit",
		archive_author: "inherit",

		singular: "inherit",
		page: "inherit",
		post: "inherit"
	};

	const [visibility, setVisibility] = useState(defaultVisibility);

	useEffect(() => {
		setVisibility({ ...defaultVisibility, ...(settings || {}) });
	}, [settings]);

	const updateField = (field, value) => {
		const updated = {
			...visibility,
			[field]: value,
		};

		setVisibility(updated);
		onChange(updated);
	};

	const renderRow = (label, field, isChild = false) => {
		return (
			<div className={`jlc-vis-row ${isChild ? "jlc-vis-child" : ""}`}>
				<div className="jlc-vis-label">{label}</div>

				<div className="jlc-vis-actions">
					<button
						className={`jlc-vis-btn ${visibility[field] === "show" ? "active show" : ""}`}
						onClick={() => updateField(field, "show")}
					>
						👁 Mostrar
					</button>

					<button
						className={`jlc-vis-btn ${visibility[field] === "hide" ? "active hide" : ""}`}
						onClick={() => updateField(field, "hide")}
					>
						🚫 Ocultar
					</button>

					<button
						className={`jlc-vis-btn ${visibility[field] === "inherit" ? "active inherit" : ""}`}
						onClick={() => updateField(field, "inherit")}
					>
						👁‍🗨 Heredar
					</button>
				</div>
			</div>
		);
	};

	return (
		<>
			<h1 className="jlc-page-title">Visibilidad</h1>

			<div className="jlc-section-card">
				{renderRow("Global", "global")}
				{renderRow("Página de inicio", "home")}
				{renderRow("Página del blog", "blog")}
				{renderRow("Página 404", "notFound")}
				{renderRow("Resultados de búsqueda", "search")}
				{renderRow("Archivo", "archive")}

				{renderRow("Archivos por fecha", "archive_date", true)}
				{renderRow("Archivos de autor", "archive_author", true)}

				{renderRow("Simple", "singular")}
				{renderRow("Página", "page", true)}
				{renderRow("Entrada", "post", true)}
			</div>
		</>
	);
}
