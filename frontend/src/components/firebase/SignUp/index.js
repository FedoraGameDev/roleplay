import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../../constants/routes";
import { Form, Message, Button, Segment } from "semantic-ui-react";

const SignUpPage = () =>
    (
        <Segment>
            <Message attached="top"><Message.Header>Sign Up</Message.Header></Message>
            <SignUpForm />
        </Segment>
    );

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    error: null
};

class SignUpFormBase extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event =>
    {
        const { username, email, passwordOne } = this.state;

        this.props.firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser =>
            {
                this.setState({ ...INITIAL_STATE });

                this.props.firebase.auth.currentUser.getIdToken(true)
                    .then(idToken =>
                    {
                        axios.post(`${ROUTES.BACKEND}/user/create`, { token: idToken, username: username })
                            .then(res =>
                            {
                                localStorage.setItem("token", idToken);
                                this.props.history.push(ROUTES.HOME);
                            })
                            .catch(error =>
                            {
                                console.log(error);
                            });
                    })
                    .catch(error =>
                    {
                        console.log(error);
                    });

            })
            .catch(error =>
            {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event =>
    {
        this.setState({ [event.target.name]: event.target.value });
    };

    render()
    {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            email === "" ||
            username === "";

        return (
            <Segment attached="bottom">
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Input name="username" value={username} onChange={this.onChange} type="text" placeholder="Username" />
                        <Form.Input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email" />
                        <Form.Input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Password" />
                        <Form.Input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirm Password" />
                    </Form.Group>
                    <Button disabled={isInvalid} type="submit" primary>Sign Up</Button>

                    {error && <p>{error.message}</p>}
                </Form>
            </Segment>
        );
    }
}

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

const SignUpLink = () =>
    (
        <p>Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link></p>
    )

export default SignUpPage;
export { SignUpForm, SignUpLink };