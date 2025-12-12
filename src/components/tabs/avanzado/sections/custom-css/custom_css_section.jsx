import { useEffect, useRef } from 'react';
import './custom_css_section.css';

export default function CustomCSSSection({ settings = {}, onChange }) {
	const editorRef = useRef(null);

	// Cargar valor inicial
	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) return;

		const cssValue = settings.custom_css ?? '';

		if (editor.innerText !== cssValue) {
			editor.innerText = cssValue;
		}
	}, [settings]);

	// Manejar escritura del usuario
	const handleInput = () => {
		if (!editorRef.current) return;
		const value = editorRef.current.innerText;
		onChange({ custom_css: value });
	};

	// Rellenar ejemplo
	const fillExample = () => {
		const example = `/* Ejemplo: personalizar el botón WhatsApp */
.wjlc-floating-btn {
	border: 3px solid #25D366;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0,0,0,0.25);
}`;
		if (editorRef.current) editorRef.current.innerText = example;
		onChange({ custom_css: example });
	};

	// Numeración de líneas
	useEffect(() => {
		if (!editorRef.current) return;

		const editorEl = editorRef.current;

		const wrapper = editorEl.parentElement;
		const lineBox = wrapper.querySelector('.jlc-line-numbers');

		// limpiar cualquier contenido previo (evita el "0" heredado)
		lineBox.innerText = '';

		const updateLineNumbers = () => {
			const text = editorEl.innerText || '';
			const realLines = text.split('\n').length;

			// mínimo 20 líneas por defecto
			const totalLines = Math.max(realLines, 20);

			let html = '';

			for (let i = 1; i <= totalLines; i++) {
				html += i + '\n';
			}

			lineBox.innerText = html;
		};

		editorEl.addEventListener('input', updateLineNumbers);
		updateLineNumbers();

		return () => {
			editorEl.removeEventListener('input', updateLineNumbers);
		};
	}, []);

	return (
		<div className="jlc-advanced-section-css">
			<div className="jlc-advanced-section-header">
				<div className="jlc-advanced-texts">
					<h2 className="jlc-advanced-title">CSS personalizado</h2>

					<p className="jlc-advanced-description">
						Añade aquí tu propio código CSS para personalizar la apariencia de
						WhatsApp JLC.
					</p>
				</div>

				<button
					type="button"
					className="jlc-btn-fill-example"
					onClick={fillExample}
				>
					Rellenar con código de ejemplo
				</button>
			</div>

			<div className="jlc-editor-wrapper">
				<div className="jlc-line-numbers" aria-hidden="true"></div>

				<pre
					ref={editorRef}
					className="jlc-code-editor"
					contentEditable={true}
					spellCheck={false}
					onInput={handleInput}
				></pre>
			</div>

			<div className="jlc-editor-footer">
				<span>Puedes encontrar ejemplos y más trucos </span>
				<a
					href="https://jlccompany.com/docs/css-whatsapp-jlc"
					target="_blank"
					rel="noopener noreferrer"
				>
					aquí.
				</a>
			</div>
		</div>
	);
}
