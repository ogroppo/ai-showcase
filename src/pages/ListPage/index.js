import React from 'react';
import {AgentsApi} from '../../api'
import { Container, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {debounce} from 'lodash';

export default class ListPage extends React.Component{
  state = {
    error: null,
    loading: true,
    agents: [],
    selectedAgents: []
  }

  service = new AgentsApi()

  componentDidMount(){
    this.setState({loading: true})
    this.service.listAgents().then((agents)=>{
      this.setState({agents})
    }).catch(error => {
      this.setState({error})
    }).finally(()=>{
      this.setState({loading: false})
    })
  }

  toggleAgent = (id) => {
    const {selectedAgents} = this.state
    const index = selectedAgents.indexOf(id)
    if(index > -1)
      selectedAgents.splice(index, 1)
    else{
      if(selectedAgents.length > 1)
        selectedAgents.pop()
      
      selectedAgents.push(id)
    }

    this.setState({
      selectedAgents
    })
  }

  filterAgents = debounce(async (searchString) => {
    try{
      const agents = await this.service.searchAgents(searchString)
      this.setState({agents})
    }catch(error){
      this.setState({error})
    }finally{
      this.setState({searching: false})
    }
  }, 200)
    
  handleOnChange = (e) => {
    const searchString = e.target.value
    this.setState({
      searchString,
      searching: true
    })
    this.filterAgents(searchString)
  }

  render(){
    const {
      agents, 
      loading,
      error,
      selectedAgents,
      searchString,
      searching
    } = this.state

    return (
      <div className="ListPage">
        <Container>
        <h1>Agent List</h1>
        <hr/>
        {
          error && <Alert variant="danger">Error: {error.message}</Alert>
        }
        {
          loading && <p>Fetching...</p>
        }
        {
          !loading && !error && <>
          <Form.Group controlId={`search-bar`} className="position-relative mb-4">
          <Form.Control type="search" value={searchString} onChange={this.handleOnChange} placeholder="Search for agent (key-sensitive)"/>
          {searching && <span style={{position: 'absolute', left: 0, top: "40px", fontSize: '.8rem'}}>Searching...</span>}
          </Form.Group>
          <ul className="pl-0 pt-1">
          {
            agents.map(agent => {
              return <li className="d-flex">
                <Form.Group controlId={`check-${agent.id}`}>
                  <Form.Check onChange={() => this.toggleAgent(agent.id)} checked={selectedAgents.includes(agent.id)} type="checkbox" aria-label="Select for comparison" />
                </Form.Group>
                <Link className="" to={`/agent/${agent.id}`}>{agent.name}</Link>
              </li>
            })
          }
          </ul>
          {
            selectedAgents.length === 2 && <Link className="btn btn-primary" to={`/compare/${selectedAgents[0]}/${selectedAgents[1]}`}>Compare Agents</Link>
          }
          {
            !!agents.length && selectedAgents.length !== 2 && <Alert variant="info">Tip: Select two agents for comparison</Alert>
          }
          {
            !!searchString && !agents.length && <Alert variant="warning">No agents found</Alert>
          }
          </>
        }
        </Container>
      </div>
    );
  }
}