import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddContractForJob = ({save, jobOfferId, farmerId}) => {

  const [jobDescription, setJobDescription] = useState("");
  const [jobTerms, setJobTerms] = useState("");
  const [wages, setWages] = useState(0);
  const [duration, setDuration] = useState("");

  const isFormFilled = () => jobDescription && jobTerms && wages && duration;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        style={{ backgroundColor: "#FFA500", borderRadius: "20px"}}
      >
        Add Contract
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Contract</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Job Description"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setJobDescription(e.target.value);
                }}
                placeholder="Enter description of job"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Job Terms"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Job Terms"
                onChange={(e) => {
                  setJobTerms(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Wages"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Wages"
                onChange={(e) => {
                  setWages(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Duration"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Duration"
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                save({farmerId, jobOfferId,jobDescription, jobTerms, wages, duration});
                handleClose();
              }}
              disabled={!isFormFilled()}
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </>
  )
}

export default AddContractForJob