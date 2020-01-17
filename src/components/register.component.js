import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button,
} from 'reactstrap';



export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            isProperInfo: false
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onSetEmail = this.onSetEmail.bind(this);
        this.onSetPassword = this.onSetPassword.bind(this);

    }



    onSubmit(e) {
        e.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.password,
        }

        axios.post('http://localhost:3000/users/register', user)
            .then(response => {
                if (response.data) {
                    console.log('success !');
                    this.setState({
                        isProperInfo: true
                    })
                    return(
                        <Redirect to="/mainscreen" />
                    );
                } else {
                    console.log('fail !')
                }
            })
            .catch((error) => { console.log(error) });
    }

    onSetEmail(e) {
        this.setState({
            email: e.target.value // target is textbox
        });
    }

    onSetPassword(e) {
        this.setState({
            password: e.target.value // target is textbox
        });
    }

    
    render() {

        if (this.state.isProperInfo) {
            return <Redirect to='/mainscreen' />;
          }

        return (
            <Container className="App">
                <h2>Register</h2>
                <Form className="form" onSubmit={this.onSubmit}>
                    <Col>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="exampleEmail"
                                placeholder="myemail@email.com"
                                onChange={this.onSetEmail}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="examplePassword"
                                placeholder="more than 5 characters"
                                onChange={this.onSetPassword}
                            />
                        </FormGroup>
                    </Col>
                        <Button >Submit</Button>
                </Form>
            </Container>
        );
    }
}