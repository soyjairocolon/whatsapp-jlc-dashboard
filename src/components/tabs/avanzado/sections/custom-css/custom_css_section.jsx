import { useEffect, useRef, useState } from 'react';
import { keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorView, highlightActiveLine, lineNumbers } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
import './custom_css_section.css';

export default function CustomCSSSection({ settings = {}, onChange }) {
	const editorRef = useRef(null);
	const viewRef = useRef(null);

	// Estado para controlar si el editor está vacío
	const [isEmpty, setIsEmpty] = useState(
		(settings.custom_css ?? '').trim().length === 0
	);

	useEffect(() => {
		if (!editorRef.current) return;

		const startCSS = settings.custom_css ?? '';

		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				const value = update.state.doc.toString();

				// Actualiza wp-settings
				onChange({ custom_css: value });

				// Detecta si está vacío para desactivar el botón
				setIsEmpty(value.trim().length === 0);
			}
		});

		const state = EditorState.create({
			doc: startCSS,
			extensions: [
				css(),
				highlightActiveLine(),
				lineNumbers(),
				EditorView.lineWrapping,
				EditorView.editable.of(true),

				/* --- 🔥 HABILITAR CTRL+Z, CTRL+Y, CTRL+C, CTRL+V, TAB, ETC ---- */
				history(), // Habilita undo/redo
				keymap.of([...defaultKeymap, ...historyKeymap]),

				updateListener,

				EditorView.theme({
					'&': {
						backgroundColor: '#f7f9fc',
						border: '1px solid #e5e7eb',
						borderRadius: '10px',
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: '13px',
					},
					'.cm-gutters': {
						backgroundColor: '#eef0f4',
						color: '#7a7f87',
						borderRight: '1px solid #d4d7dd',
					},
					'.cm-activeLine': {
						backgroundColor: '#e8f2ff',
					},
				}),
			],
		});

		viewRef.current = new EditorView({
			state,
			parent: editorRef.current,
		});

		return () => {
			viewRef.current?.destroy();
		};
	}, []);

	// Insertar ejemplo, solo si el editor está vacío
	const fillExample = () => {
		if (!viewRef.current || !isEmpty) return;

		const example = `/* Ejemplo: personalizar el botón WhatsApp */
.wjlc-floating-btn {
	border: 3px solid #25D366;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0,0,0,0.25);
}`;

		viewRef.current.dispatch({
			changes: {
				from: 0,
				to: viewRef.current.state.doc.length,
				insert: example,
			},
		});
	};

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
					disabled={!isEmpty}
					style={{
						opacity: isEmpty ? 1 : 0.5,
						cursor: isEmpty ? 'pointer' : 'not-allowed',
					}}
				>
					Rellenar con código de ejemplo
				</button>
			</div>

			<div ref={editorRef} className="jlc-codemirror-container"></div>

			<p className="jlc-editor-info">
				Puedes encontrar ejemplos y más trucos{' '}
				<a
					href="https://developer.mozilla.org/es/docs/Web/CSS"
					target="_blank"
					rel="noopener noreferrer"
				>
					aquí
				</a>
				.
			</p>
		</div>
	);
}
