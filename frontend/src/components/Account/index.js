import React from "react";
import { withAuthorization } from "../firebase/Session";
import { PasswordForgetForm } from "../firebase/PasswordForget";
import PasswordChangeForm from "../firebase/PasswordChange";
import * as ROUTES from "../../constants/routes";
import { Segment, Header } from "semantic-ui-react";

class AccountPage extends React.Component
{
    render()
    {
        console.log(this.props.userInfo);
        return (
            <Segment>
                <Header as="h1">{this.props.userInfo.user.username}</Header>
                <Header as="h3">{this.props.userInfo.authUser.email}</Header>
                <PasswordForgetForm />
                <PasswordChangeForm />
            </Segment>
        );
    }
}

const condition = (userInfo) => !!(userInfo && userInfo.authUser);
const badCheck = (history) => history.push(`${ROUTES.SIGN_IN}?forward=account`);

export default withAuthorization(condition, badCheck)(AccountPage);