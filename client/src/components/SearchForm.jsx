import Form from 'react-bootstrap/Form'
import FormLabel from 'react-bootstrap/FormLabel'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'

// child form component from Home component
const SearchForm = ({ setSearchText }) => {
  return (
    <Form>
      <Row>
        <Col lg={8} sm={6}>
          <FormGroup>
            <FormLabel htmlFor="search"></FormLabel>
            <FormControl
              type="text"
              placeholder="search post title, tags, description or entry"
              onChange={({ target }) => setSearchText(target.value)}
              size="lg"
            />
          </FormGroup>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchForm
