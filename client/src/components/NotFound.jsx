import { Link, useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

// main component for 404 page
const NotFound = () => {
  const location = useLocation()
  return (
    <Container className="wrapper">
      <h2>HTTP 404</h2>
      <p>
        We don&apos;t have <strong>{location.pathname}</strong> route exist! Please go back to{' '}
        <Link to={'/'}>home page</Link>
      </p>
    </Container>
  )
}

export default NotFound
