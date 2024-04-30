import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { createFarmManagerProfile } from "../../utils/farmWorkChain";

const CreateFarmManagerProfile = ({fetchManager}) => {
    const [name, setName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [location, setlocation] = useState("");
    const [experience, setExperience] = useState("");

    const handlePublishProfile = async () => {
        try {
            const manager = {
                name,
                contactNo,
                location,
                experience
            }
            await createFarmManagerProfile(manager).then((res) => {
                console.log(res);
                fetchManager();
            } );
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
        <Container className="mt-4">
            <h1>Create Manager Profile</h1>
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
                <Form.Label>location</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setlocation(e.target.value)}
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
            <Button onClick={handlePublishProfile}>Create Profile</Button>
            </Form>
        </Container>
    </>
  )
}

export default CreateFarmManagerProfile;