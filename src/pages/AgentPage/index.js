import React from 'react';
import { AgentsApi } from '../../api'
import { Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import addCategoryStats from '../../lib/addCategoryStats';

export default class AgentPage extends React.Component{
  state = {
    error: null,
    loading: true,
    agents: []
  }

  service = new AgentsApi()
  
  componentDidMount(){
    const {agentId} = this.props.match.params;
    
    this.setState({loading: true})
    this.service.getAgent(+agentId).then((agent)=>{
      addCategoryStats(agent)
      this.setState({agent})
    }).catch(error => {
      this.setState({error})
    }).finally(()=>{
      this.setState({loading: false})
    })
  }

  render(){
    const {agent, loading, error} = this.state
    return (
      <div className="AgentPage">
        <Container>
        <Link to={`/`}>{`<-`} Back to Agent List</Link>
        <h1>Agent overview</h1>
        <hr></hr>
        {
          error && <Alert variant="danger">Error: {error.message}</Alert>
        }
        {
          loading && <p>Fetching...</p>
        }
        {
          !loading && !error &&
          <div>
            <h2>{agent.name}</h2>
            <p>{agent.description}</p>
            <h3>Average Task Score</h3>
            <ul>
              {
                agent.categories.map(category => {
                return <li><b>{category.name}</b>: {category.avg}</li>
                })
              }
            </ul>
          </div>
        }
        </Container>
      </div>
    );
  }
}