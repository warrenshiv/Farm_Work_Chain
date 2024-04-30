import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Nav, Table, Tab } from 'react-bootstrap'


const ManagerDashboard = ({manager}) => {
    
      const {name, contactNo, location} = manager;
    
      return (
     <Container>
        <Row>
          <Col>
             <h1>Manager Dashboard</h1>
             <h2>{name}</h2>
             <h3>{contactNo}</h3>
             <h3>{location}</h3>
          </Col>
        </Row>
     </Container>
      )
    }

export default ManagerDashboard;