import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../../constants/routes";

const SignUpPage = () =>
    (
        <div>
            <h1>Sign Up</h1>
            <SignUpForm />
        </div>
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
                console.log("Created user at Firebase.");
                this.setState({ ...INITIAL_STATE });

                this.props.firebase.auth.currentUser.getIdToken(true)
                    .then(idToken =>
                    {
                        console.log("Acquired id token.");
                        axios.post(`${ROUTES.BACKEND}/user/create`, { token: idToken, username: username })
                            .then(res =>
                            {
                                console.log("Created user in local DB");
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
        //
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
            <form onSubmit={this.onSubmit}>
                <input name="username" value={username} onChange={this.onChange} type="text" placeholder="Username" />
                <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email" />
                <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Password" />
                <input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirm Password" />
                <button disabled={isInvalid} type="submit">Sign Up</button>

                {error && <p>{error.message}</p>}
            </form>
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