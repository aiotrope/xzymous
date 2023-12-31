import { Link } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Highlighter from './misc/highlighter'

// child component of UpdateSnippet that renders the none persistent state before and after update
const UpdatedSnippet = ({ post }) => {
  return (
    <>
      <Row className="my-3">
        <Col>
          <p>
            Title:{' '}
            <Link to={`/snippet/${post?.id}`} className="post-title">
              {post?.title}
            </Link>
          </p>
          <p>Description: {post?.description}</p>
          <p>
            Tags:{' '}
            {post?.tags?.map((tag, indx) => (
              <Badge key={indx} className="mx-1">
                {tag}
              </Badge>
            ))}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Posted by:{' '}
            <Link to={`/user/${post?.user?.id}`} className="text-primary">
              {post?.user?.username}
            </Link>
          </p>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[gfm]} components={Highlighter}>
            {post?.entry}
          </ReactMarkdown>
        </Col>
      </Row>
    </>
  )
}

export default UpdatedSnippet
