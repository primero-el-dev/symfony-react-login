import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { API_TOKEN_STORAGE_KEY, CSRF_TOKEN_INPUT_NAME } from '../config.jsx'


export default class LoginForm extends React.Component {
    
    constructor (props) {
        super(props)
        this.action = props.action
        this.redirectUri = props.redirectUri
        this.csrfToken = props.csrfToken
        this.state = {
            errorMessage: '',
            waitingForResponse: false
        }
        this.onSubmit = this.onSubmit.bind(this)
    }

    async onSubmit(event) {
        event.preventDefault()

        this.setState({ waitingForResponse: true, errorMessage: '' })
        this.forceUpdate()

        try {
            const email = event.target.querySelector('[name="email"]').value
            const password = event.target.querySelector('[name="password"]').value
            const csrfToken = event.target.querySelector(`[name="${CSRF_TOKEN_INPUT_NAME}"]`).value

            const response = await fetch(this.action, {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                    [CSRF_TOKEN_INPUT_NAME]: csrfToken,
                })
            })
            const data = await response.json()

            // console.error(await response)
            // console.error(await response.json())
            if (response.status === 200) {
                window.location.href = this.redirectUri
            } else if (data.message !== undefined) {
                this.setState({ errorMessage: data.message })
            } else {
                this.setState({ errorMessage: 'Spróbuj ponownie' })
            }
        } catch (e) {
            console.error(e)
        }

        this.setState({ waitingForResponse: false })
        this.forceUpdate()
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} action={this.action}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Adres email</Form.Label>
                    <Form.Control type="text" name="email" placeholder="Wpisz adres email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Hasło</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Wpisz hasło" required />
                </Form.Group>

                <input type="hidden" name={CSRF_TOKEN_INPUT_NAME} value={this.csrfToken} />

                <div id="errorMessage" className="d-hidden text-danger mb-2">{this.state.errorMessage}</div>
                
                <Button id="submitButton" type="submit" className="w-100" disabled={this.state.waitingForResponse}>Zaloguj</Button>
            </Form>
        )
    }
}