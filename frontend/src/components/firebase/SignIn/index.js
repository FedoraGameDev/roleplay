import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import withNavLink from "../../Navigation/withNavLink";
import * as ROUTES from "../../../constants/routes";

const SignInPage = () => (
    <div>
        <h1>Sign In</h1>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
    </div>
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
                            this.props.navlink.goToLink(query["forward"], this.props.history);
                        else
                            this.props.navlink.goToLink(ROUTES.HOME, this.props.history);
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
            <form onSubmit={this.onSubmit}>
                <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email" />
                <input name="password" value={password} onChange={this.onChange} type="password" placeholder="Password" />
                <button disabled={isInvalid} type="submit">Sign In</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(withRouter, withFirebase, withNavLink())(SignInFormBase);

export default SignInPage;

export { SignInForm };