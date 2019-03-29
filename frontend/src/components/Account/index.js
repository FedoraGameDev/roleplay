import React from "react";
import { withAuthorization } from "../firebase/Session";
import { PasswordForgetForm } from "../firebase/PasswordForget";
import PasswordChangeForm from "../firebase/PasswordChange";
import * as ROUTES from "../../constants/routes";

class AccountPage extends React.Component
{
    render()
    {
        return (
            <div>
                <h1>Account: {this.props.userInfo.user.email}</h1>
                <PasswordForgetForm />
                <PasswordChangeForm />
            </div>
        );
    }
}

const condition = (userInfo) => !!(userInfo && userInfo.authUser);
const badCheck = (history) => history.push(`${ROUTES.SIGN_IN}?forward=account`);

export default withAuthorization(condition, badCheck)(AccountPage);