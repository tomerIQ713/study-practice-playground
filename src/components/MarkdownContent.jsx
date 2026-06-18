import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function MarkdownContent({ children, className = '' }) {
  if (!children) return null

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\n$/, '')
            if (match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: 6, fontSize: 12 }}
                >
                  {code}
                </SyntaxHighlighter>
              )
            }
            return <code className="md-inline-code" {...props}>{children}</code>
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
