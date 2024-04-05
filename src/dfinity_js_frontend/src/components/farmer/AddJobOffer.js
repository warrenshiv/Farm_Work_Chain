import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddJobOffer = ({save, farmerId}) => {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [duration, setDuration] = useState("");


    const isFormFilled = () =>  jobTitle && jobDescription && duration;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  return (
    <>
        <Button
            onClick={handleShow}
            variant="dark"
        >
            Add Job Offer
        </Button>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>New Job Offer</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <FloatingLabel
                        controlId="inputName"
                        label="Job Title"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            onChange={(e) => {
                                setJobTitle(e.target.value);
                            }}
                            placeholder="Enter title of job"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="inputUrl"
                        label="Job Description"
                        className="mb-3"
                    >
                        <Form.Control
                            type="text"
                            placeholder="Job Description"
                            onChange={(e) => {
                                setJobDescription(e.target.value);
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
                            save({
                                farmerId,
                                jobTitle,
                                jobDescription,
                                duration
                            });
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

export default AddJobOffer