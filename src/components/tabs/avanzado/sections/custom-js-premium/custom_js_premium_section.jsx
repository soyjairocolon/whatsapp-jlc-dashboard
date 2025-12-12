import { useEffect, useRef, useState } from 'react';
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
	openPremiumModal,
}) {
	const editorRef = useRef(null);
	const viewRef = useRef(null);

	// Cambiar cuando Premium esté activo
	const isPremiumUnlocked = false;

	// Detectar si el editor tiene contenido → bloquear botón
	const [hasContent, setHasContent] = useState(() => {
		return (settings?.custom_js ?? '').trim().length > 0;
	});

	useEffect(() => {
		if (!editorRef.current) return;

		const initialCode = settings?.custom_js ?? '';

		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				const value = update.state.doc.toString();

				// Detectar contenido para bloquear el botón
				setHasContent(value.trim().length > 0);

				if (isPremiumUnlocked) {
					onChange({ custom_js: value });
				}
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

				EditorView.editable.of(isPremiumUnlocked),

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

	// Rellenar con ejemplo (si no Premium → abrir modal)
	const fillExample = () => {
		if (!isPremiumUnlocked) {
			openPremiumModal();
			return;
		}

		if (!viewRef.current) return;

		const example = `/* Ejemplo código JS */
setInterval(() => {
	const btn = document.querySelector(".wjlc-floating-btn");
	if (!btn) return;
	btn.style.backgroundColor =
		btn.style.backgroundColor === "red" ? "#25D366" : "red";
}, 2000);`;

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
						JS personalizado{' '}
						{!isPremiumUnlocked && (
							<span className="jlc-premium-tag">Premium</span>
						)}
					</h2>

					<p className="jlc-advanced-description">
						Añade aquí código JavaScript para extender funcionalidades
						avanzadas.
					</p>
				</div>

				<button
					type="button"
					className={
						'jlc-btn-fill-example ' +
						(!isPremiumUnlocked || hasContent ? 'jlc-btn-premium-locked' : '')
					}
					onClick={fillExample}
				>
					Rellenar con código de ejemplo
				</button>
			</div>

			{/* Editor */}
			<div className="jlc-editor-wrapper">
				<div
					ref={editorRef}
					className={
						'jlc-codemirror-container ' +
						(!isPremiumUnlocked ? 'jlc-editor-locked' : '')
					}
					onClick={() => {
						if (!isPremiumUnlocked) openPremiumModal();
					}}
				></div>

				{/* Overlay Premium */}
				{!isPremiumUnlocked && (
					<div className="jlc-premium-overlay" onClick={openPremiumModal}>
						<div className="jlc-premium-overlay-content">
							<div className="jlc-lock-icon">🔒</div>
							Requiere Premium
						</div>
					</div>
				)}
			</div>

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
