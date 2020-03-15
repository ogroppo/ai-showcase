import React from 'react';
import {AgentsApi} from '../../api'
import { Container, Form, Row, Col, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import addCategoryStats from '../../lib/addCategoryStats';
import './ComparePage.scss';

export default class ComparePage extends React.Component{
  state = {
    error: null,
    loading: true,
    agent1: null,
    agent2: null,
  }

  service = new AgentsApi

  componentDidMount(){
    const {agent1Id, agent2Id} = this.props.match.params;

    this.setState({loading: true})
    Promise.all([
      this.service.getAgent(+agent1Id),
      this.service.getAgent(+agent2Id)
    ]).then(([agent1, agent2])=>{
      addCategoryStats(agent1)
      addCategoryStats(agent2)
      this.setState({
        agent1,
        agent2,
      })
    }).catch(error => {
      this.setState({error})
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  render(){
    const {agent1, agent2, loading, error} = this.state
    return (
      <div className="ComparePage">
        <Container>
        <Link to={`/`}>{`<-`} Back to Agent List</Link>
        <h1>Compare Agents</h1>
        <hr/>
        {
          error && <p>Error: {error.message}</p>
        }
        {
          loading && <p>Fetching agents...</p>
        }
        {
          !error && !loading && <>
          <Row>
            <Col>
              <h2>{agent1.name}</h2>
              <ul>
                {
                  agent1.categories.map(category => {
                  return <li><h3>{category.name}</h3>
                  <ProgressBar now={category.avg} label={`${category.avg}`} />
                  </li>
                  })
                }
              </ul>  
            </Col>
            <Col>
            <h2>{agent2.name}</h2>
              <ul>
                {
                  agent2.categories.map(category => {
                  return <li><h3>{category.name}</h3>
                  <ProgressBar now={category.avg} label={`${category.avg}`} />
                  </li>
                  })
                }
              </ul>  
            </Col>
          </Row>
          </>
        }
        </Container>
      </div>
    );
  }
}