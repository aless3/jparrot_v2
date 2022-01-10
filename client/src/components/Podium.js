import React from 'react'
import { Container, Row } from 'react-bootstrap'
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import TweetList from './TweetList'
import "./Podium.css"

const Podium = () => {
    return (
        <Container>
            <Row className="d-flex align-items-end">
                <Col xs={4}>
                <Card border="light" style={{ width:"20vw", top: "7em"}}>
                    <Card.Header>Header</Card.Header>
                        <Card.Body>
                            <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                        Some quick example text to build on Some Some quick example text to build on Some Some quick example text to build on Some quick example text to build o n Some quick example texaquick example texaquick example texaquick example texaquick example texaquick example example mple 321
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col xs={4}>
                <Card border="light" style={{ width:"20vw",top: "0.5em"}}>
                    <Card.Header>Header</Card.Header>
                        <Card.Body>
                            <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                        Some quick example text to build on Some Some quick example text to build on Some Some quick example text to build on Some quick example text to build o n Some quick example texaquick example texaquick example texaquick example texaquick example texaquick example example mple 321 
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
                <Col xs={4}>
                <Card border="light" style={{ width:"20vw", top: "14em"}}>
                    <Card.Header>Header</Card.Header>
                        <Card.Body>
                            <Card.Title>Light Card Title</Card.Title>
                        <Card.Text>
                        Some quick example text to build on Some Some quick example text to build on Some Some quick example text to build on Some quick example text to build o n Some quick example texaquick example texaquick example texaquick example texaquick example texaquick example
                        example mple 321
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Col>
            </Row>
            <br/>
            <br/>
            <Row className="d-flex align-items-end">
                <Col xs={4}>
                    <div className="">
                        <div className="second"></div>
                    </div>
                </Col>
                <Col xs={4}>
                    <div className="">
	                    <div className="first"></div>
                    </div>
                </Col>
                <Col xs={4} style={{ width:"20vw"}}>
                    <div className="">
	                    <div className="third"></div>
                    </div>
                </Col>
            </Row>
            <br/>
        </Container>
    )
}

export default Podium
