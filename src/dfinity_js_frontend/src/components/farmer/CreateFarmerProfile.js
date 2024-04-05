import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { createFarmerProfile } from "../../utils/farmWorkChain";

const CreateFarmerProfile = ({fetchFarmer}) => {

    const [name, setName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [farmSizing, setFarmSize] = useState(0);
    const [location, setLocation] = useState("");
    
    const handlePublishProfile = async () => {
        const farmS = parseInt(farmSizing);
        try {

            const farmer = {
                name,
                contactNo,
                farmSize: farmS,
                location
            }

            await createFarmerProfile(farmer).then((res) => {
                console.log(res);
                fetchFarmer();
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
                <h1>Create Farmer Profile</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            size="sm"
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
                        <Form.Label>Farm Size</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter your farm size"
                            value={farmSizing}
                            onChange={(e) => setFarmSize(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        className="mt-3"
                     variant="primary" onClick={handlePublishProfile}>
                        Publish Profile
                    </Button>
                </Form>
            </Container>

        </>
    )
}

export default CreateFarmerProfile