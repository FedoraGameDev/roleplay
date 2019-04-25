import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../../constants/routes";
import { Form, Icon, Button, Segment, Message } from "semantic-ui-react";

const SignInPage = () => (
    <Segment>
        <Message attached="top"><Message.Header>Sign In</Message.Header></Message>
        <SignInForm />
        <Message attached="bottom" warning>
            <Icon name="help" />
            Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
        </Message>
    </Segment>
);

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
    query: {}
};

class SignInFormBase extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event =>
    {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() =>
            {
                this.props.firebase.auth.currentUser.getIdToken(true)
                    .then(idToken =>
                    {
                        localStorage.setItem("token", idToken);
                        const query = {};
                        if (this.props.location.search)
                        {
                            const search = this.props.location.search.split("?")[1].split("&");
                            search.forEach(element =>
                            {
                                const variable = element.split("=");
                                query[variable[0]] = variable[1];
                            });
                        }
                        if (!!query && !!query["forward"])
                            this.props.history.push(query["forward"]);
                        else
                            this.props.history.push(ROUTES.HOME);
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
        const { email, password, error } = this.state;

        const isInvalid = password === "" || email === "";

        return (
            <Form onSubmit={this.onSubmit} className="attached fluid segment">
                <Form.Group>
                    <Form.Input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email" />
                    <Form.Input name="password" value={password} onChange={this.onChange} type="password" placeholder="Password" />
                </Form.Group>
                <Button primary disabled={isInvalid} type="submit">Sign In</Button>
                <Button secondary onClick={() => this.props.history.push(ROUTES.PASSWORD_FORGET)}>Forgot Password?</Button>
            </Form>
        );
    }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

export { SignInForm };