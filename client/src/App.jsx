import { BrowserRouter } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import { ToastContainer } from 'react-toastify'

import Header from './components/header'
import Router from './components/router'

import './utils/sass/_App.scss'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main className="my-5">
        <Container>
          <ToastContainer />
          <Router />
        </Container>
      </main>
    </BrowserRouter>
  )
}

export default App
