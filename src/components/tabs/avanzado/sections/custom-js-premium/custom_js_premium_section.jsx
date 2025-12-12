import { useEffect, useRef } from 'react';
import {
	EditorView,
	highlightActiveLine,
	lineNumbers,
	keymap,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import './custom_js_premium_section.css';

export default function CustomJSPremiumSection({
	settings,
	onChange,
	// openPremiumModal,
}) {
	const editorRef = useRef(null);
	const viewRef = useRef(null);

	useEffect(() => {
		if (!editorRef.current) return;

		// Carga inicial desde settings
		const initialCode = settings?.custom_js ?? '';

		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				const value = update.state.doc.toString();
				onChange({ custom_js: value });
			}
		});

		const state = EditorState.create({
			doc: initialCode,
			extensions: [
				javascript(),
				history(),
				keymap.of([...defaultKeymap, ...historyKeymap]),
				highlightActiveLine(),
				lineNumbers(),
				EditorView.lineWrapping,
				EditorView.editable.of(true),
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

		return () => viewRef.current?.destroy();
	}, []);

	// Insertar ejemplo
	const fillExample = () => {
		if (!viewRef.current) return;

		const example = `/* Ejemplo JS Premium */
document.addEventListener("DOMContentLoaded", () => {
	console.log("WhatsApp JLC Premium activado.");
});`;

		viewRef.current.dispatch({
			changes: {
				from: 0,
				to: viewRef.current.state.doc.length,
				insert: example,
			},
		});

		onChange({ custom_js: example });
	};

	return (
		<div className="jlc-advanced-section-css jlc-premium-section">
			<div className="jlc-advanced-section-header">
				<div className="jlc-advanced-texts">
					<h2 className="jlc-advanced-title">
						JS personalizado
						{/* <span className="jlc-premium-tag">Premium</span> */}
					</h2>

					<p className="jlc-advanced-description">
						Añade aquí código JavaScript para extender funcionalidades
						avanzadas.
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

			<div ref={editorRef} className="jlc-codemirror-container"></div>

			<p className="jlc-editor-info">
				Puedes encontrar ejemplos y más trucos de Javascript{' '}
				<a
					href="https://developer.mozilla.org/es/docs/Web/JavaScript"
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
