import React from "react";
import { AuthUserContext, withAuthorization } from "../firebase/Session";
import { PasswordForgetForm } from "../firebase/PasswordForget";
import PasswordChangeForm from "../firebase/PasswordChange";

const AccountPage = () =>
    (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <h1>Account: {authUser.email}</h1>
                    <PasswordForgetForm />
                    <PasswordChangeForm />
                </div>
            )}
        </AuthUserContext.Consumer>
    );

const condition = (userAuth) => !!userAuth;

export default withAuthorization(condition)(AccountPage);