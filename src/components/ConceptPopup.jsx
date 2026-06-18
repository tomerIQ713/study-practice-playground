import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import './ConceptPopup.css'

export default function ConceptPopup({ exercise, onClose }) {
  if (!exercise || !exercise.concept) return null

  return (
    <div className="concept-popup__backdrop" onClick={onClose}>
      <div className="concept-popup__card" onClick={(e) => e.stopPropagation()}>
        <div className="concept-popup__header">
          <h3 className="concept-popup__title">{exercise.title}</h3>
          <button className="concept-popup__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="concept-popup__body">
          <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {exercise.concept}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
