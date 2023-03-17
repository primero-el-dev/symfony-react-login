import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LoginForm from '../forms/LoginForm'


export default function (props) {
    return (
        <Container className="py-5">
            <Row>
                <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                    <h1 className="mb-3">Logowanie</h1>
                    <LoginForm action={props.action} redirectUri={props.redirectUri} csrfToken={props.csrfToken}/>
                </Col>
            </Row>
        </Container>
    )
}