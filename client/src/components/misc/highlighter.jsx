import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
//import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

// highlighting markdown and codes
const Highlighter = {
  // eslint-disable-next-line no-unused-vars
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter
        style={base16AteliersulphurpoolLight}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

export default Highlighter
