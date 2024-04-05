import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Nav, Table, Tab } from 'react-bootstrap'
import { getAllContracts } from '../../utils/farmWorkChain';
import ContractsCard from '../../components/worker/ContractsCard';


const WorkerDashboard = ({worker}) => {

  const {name, contactNo, address, experience, earnedPoints, verified} = worker;

  const [contracts, setContracts] = useState([])

  const fetchContracts = async () => {
    try {
      setContracts(
        await getAllContracts()
      )
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchContracts();
  } , []);

  return (
    <div className='mx-5' >
      <Container className="mt-2">
        <h1>Worker Dashboard</h1>
        <Row className='d-flex justify-content-center align-items-center p-2' style={{backgroundColor:"gray", borderRadius: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
          <Col className='flex-1'>

          <Image   src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '150px' }} />
          </Col>
          <Col className='flex-1'>
            <h3>{name}</h3>
            <p>Contact Number: {contactNo}</p>
            <p>Location: {address}</p>
            <p>Rating: {experience}</p>
            <p>Verified: {earnedPoints.toString()}</p>
            <p>Verified: {verified.toString()}</p>
          </Col>


        </Row>
        <Row  className="mx-2 my-4">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Job Id</th>
                <th>Farmer Id</th>
                <th>Wages</th>
                <th>Duration</th>
                <th>View</th>
              </tr>
            </thead>
            {/* map contracts here use listing of contractId and farmerId */}
            {contracts.map((_contract, index) => (
              <ContractsCard 
                key={index}
                contract={{..._contract}}
                workerId={worker.workerId}
              />
            ))}
          </Table>
        </Row>

        </Container>
        </div>
  )
}

export default WorkerDashboard