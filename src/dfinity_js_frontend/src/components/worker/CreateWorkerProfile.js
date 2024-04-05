import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { createWorkerProfile } from "../../utils/farmWorkChain";


const CreateWorkerProfile = ({fetchWorker}) => {
    const [name, setName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [address, setAddress] = useState("");
    const [experience, setExperience] = useState("");

    const handlePublishProfile = async () => {
        try {
            const worker = {
                name,
                contactNo,
                address,
                experience
            }
            await createWorkerProfile(worker).then((res) => {
                console.log(res);
                fetchWorker();
            } );
        } catch (error) {
            console.log(error);
        }
    }

  return (
    // This section is the form for creating a worker profile
    // This is to fill the set** variables with the user input
    // Then handle the form submission
    <>
        <Container className="mt-4">
            <h1>Create Worker Profile</h1>
            <Form>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                width={'50%'}
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter your contact number"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Experience</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter your experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" className="mt-2" onClick={handlePublishProfile}>
                Publish Profile
            </Button>
            </Form>
        </Container>
    </>
  )
}

export default CreateWorkerProfile