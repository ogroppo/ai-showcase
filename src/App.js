import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Navbar, Container} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ListPage from './pages/ListPage'
import AgentPage from './pages/AgentPage';
import ComparePage from './pages/ComparePage';

function App() {
  return (
    <Router className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="/">AI showcase</Navbar.Brand>
        </Container>
      </Navbar>
      <Switch>
        <Route exact path="/">
          <ListPage />
        </Route>
        <Route exact path="/agent/:agentId" component={AgentPage} />
        <Route exact path="/compare/:agent1Id/:agent2Id" component={ComparePage} />
      </Switch>
    </Router>
  );
}

export default App;
