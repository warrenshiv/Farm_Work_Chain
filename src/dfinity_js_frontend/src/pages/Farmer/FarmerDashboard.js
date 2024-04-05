import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Nav, Table, Tab } from 'react-bootstrap'
import { acceptContract, createJobOffer, getAcceptedContracts, getAllContracts, getAllJobOffers, getCompletedContracts } from '../../utils/farmWorkChain';
import JobOfferCard from '../../components/farmer/JobOfferCard';
import AcceptedContracts from '../../components/farmer/AcceptedContracts';
import CompletedContracts from '../../components/farmer/CompletedContracts';
import AddJobOffer from '../../components/farmer/AddJobOffer';

const FarmerDashboard = ({farmer}) => {

  const {name, contactNo, farmSize, location, rating, verified} = farmer;

  const [offerJobs , setOfferJobs] = useState([])
  const [acceptContracts, setAcceptContracts] = useState([])
  const [completeContracts, setCompleteContracts] = useState([])

  const [selectedTab, setSelectedTab] = useState('current')

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if(tab === "current"){
      // Get all Job Offers 
      fetchAllJobs();
    } else if(tab === "accepted"){
      // Get all Contracts with accepted status
      fetchAcceptedContracts();
    } else if(tab === "complete"){
      // get all Contracts with Complete status
      fetchCompletedContracts();
    }
  }

  console.log("offerJobs", offerJobs)
  console.log("completeContracts", completeContracts)
  console.log("acceptContracts", acceptContracts)

  const fetchAllJobs = async () => {
    try {
      setOfferJobs(
        await getAllJobOffers()
      )
    } catch (error) {
      console.log(error);
    }
  }

  // get All Contracts
  const fetchAllContracts = async () => {
    try {
      console.log("contracts", await getAllContracts())
    } catch (error) {
      console.log(error);
    }
  }

  const fetchAcceptedContracts = async () => {
    try {
      setAcceptContracts(
        await getAcceptedContracts()
      )
    } catch (error) {
      console.log(error);
    }
  }


  const fetchCompletedContracts = async () => {
    try {
      setCompleteContracts(
        await getCompletedContracts()
      )
    } catch (error) {
      console.log(error);
    }
  }

  const placeJobOffer = async (data) => {
    try {
      await createJobOffer(data)
    } catch (error) {
      console.log(error);
    }
  }


  




  useEffect (() => {
    fetchAllJobs()
    fetchAllContracts()
  }
  ,[])
  return (
    <div className='mx-5' >
      <Container className="mt-2">
        <h1>Farmer Dashboard</h1>
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
            <p>Farm Size: {farmSize.toString()}</p>
            <p>Location: {location}</p>
            <p>Rating: {rating.toString()}</p>
            <p>Verified: {verified.toString()}</p>
          </Col>
          {/* Button to handle Add Job */}
          <Col className='flex-1'>
            <AddJobOffer save={placeJobOffer} farmerId={farmer.farmerId} />
          </Col>  

        </Row>

        <Container fluid className='mt-3'>
            <Nav variant="pills" defaultActiveKey="#current" className="justify-content-center ">
              <Nav.Item  className="mx-3">
                <Nav.Link   
                  onClick={() => handleTabClick('current')}
                  active={selectedTab === 'current'}
                  style={{color: "black" , backgroundColor: "grey"}}
                >
                  Current Jobs
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mx-3">
                <Nav.Link
                  onClick={() => handleTabClick('accepted')}
                  active={selectedTab === 'accepted'}
                  style={{color: "black", backgroundColor: "grey"}}
                >
                  Accepted Contracts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mx-3">
                <Nav.Link
                  onClick={() => handleTabClick('complete')}
                  active={selectedTab === 'complete'}
                  style={{color: "black", backgroundColor: "grey"}}
                >
                  Completed Contracts
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
          <Row  className="mx-2 my-4">
            { selectedTab === "current" && (

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Job Description</th>
                    <th>Duration</th>
                    <th>Contract</th>
                  </tr>
                </thead>
              {selectedTab === "current" && offerJobs.map((_offerJob, index) => (
                <JobOfferCard
                key={index}
                offerJob={{
                  ..._offerJob,
                }}
                farmerId={farmer.farmerId}
                getAllJobOffers={fetchAllJobs}
                />
                ))}
              </Table>
              )}
              { selectedTab === "accepted" && (

                <Table striped bordered hover responsive>
               <thead>
                 <tr>
                   <th>Contract Id</th>
                   <th>Job Terms</th>
                   <th>Wages</th>
                    <th>Duration</th>
                   <th>Pay</th>
                 </tr>
               </thead>
            {selectedTab === "accepted" && acceptContracts.map((_acceptedContract, index) => (
              <AcceptedContracts
              key={index}
              acceptedContract={{
                ..._acceptedContract,
              }}
              getAcceptedContracts={fetchAcceptedContracts}
              />
              
              ))}
              </Table>
              )}


              { selectedTab === "complete" && (

                <Table striped bordered hover responsive>
               <thead>
                 <tr>
                   <th>Contract Id</th>
                   <th>Job Terms</th>
                   <th>Wages</th>
                    <th>Duration</th>
                   <th>Status</th>
                 </tr>
               </thead>
            {selectedTab === "complete" && completeContracts.map((_completeContract, index) => (
              <CompletedContracts
              key={index}
              completeContract={{
                ..._completeContract,
                }}
                getCompletedContracts={fetchCompletedContracts}
                />
                ))}
              </Table>
                )}
        </Row>
      </Container>
    </div>
  )
}

export default FarmerDashboard