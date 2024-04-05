import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import { acceptContract, getContract } from "../../utils/farmWorkChain";

const TakeContract = ({contractId, workerId}) => {

    // Pull this params from Worker profile and Contract Listing
    const [contract, setContract] = useState({})

    const { farmerId, jobOfferId, jobDescription, jobTerms, wages,  duration, status} = contract;

    console.log("contract", contract)

    const [loading, setLoading] = useState(false);


    const fetchContractDetails =  useCallback(async () => {
      try {
        setLoading(true);
        await getContract(contractId).then(async (res) => {
          console.log("res", res);
          setContract(res.Ok);
        } );
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    );

    const handleAccept = async () => {
      try {
        await acceptContract(contractId, workerId);
      } catch (error) {
        console.log(error);
      }
    }

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchContractDetails();
  } , []);
  return (
    <>
    <Button variant="primary" onClick={handleShow}>
      View Contract
    </Button>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contract Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Farmer ID: {farmerId}</p>
        <p>Job Offer ID: {jobOfferId}</p>
        <p>Job Description: {jobDescription}</p>
        <p>Job Terms: {jobTerms}</p>
        <p>Wages: {wages ? wages.toString(): 0}  ICP</p>
        <p>Duration: {duration}</p>
        <p>Status: {status}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={
          () => {
            handleAccept();
            handleClose(); 
          }
          }>
          Accept Contract
        </Button>
      </Modal.Footer>
    </Modal>


    </>
  )
}

export default TakeContract