import React from "react";
import { withRouter } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { compose } from "recompose";
import { withFirebase } from "../firebase/Firebase";
import { withAuthStatic } from "../firebase/Session";
import * as ROUTES from "../../constants/routes";

class Navigation extends React.Component
{
    clickLink = to =>
    {
        this.props.history.push(to);
    }

    RenderNavigation(myself)
    {
        const { props, clickLink } = myself.myself;
        const { userInfo } = props;
        if (!!userInfo)
        {
            return (
                <Menu inverted>
                    <Menu.Item onClick={event => { clickLink(ROUTES.HOME) }} >Home</Menu.Item>
                    <Menu.Item onClick={event => { clickLink(ROUTES.ACCOUNT) }} >Account</Menu.Item>
                    <Menu.Item onClick={event => { clickLink(ROUTES.LIST_STORY) }} >Stories</Menu.Item>
                    <Menu.Item onClick={event => { clickLink(ROUTES.LIST_CHARACTERS) }} >Characters</Menu.Item>
                    <Menu.Item onClick={event => { props.firebase.doSignOut(); props.history.push("/"); }} >Log Out</Menu.Item>
                </Menu>
            );
        }
        else
        {
            return (
                <Menu inverted>
                    <Menu.Item onClick={event => { clickLink(ROUTES.LANDING) }} >Home</Menu.Item>
                    <Menu.Item onClick={event => { clickLink(ROUTES.LIST_STORY) }} >Stories</Menu.Item>
                    <Menu.Item onClick={event => { clickLink(ROUTES.SIGN_IN) }} >Sign In</Menu.Item>
                </Menu>
            );
        }
    }

    render()
    {
        return (
            <this.RenderNavigation myself={this} />
        );
    }
}

export default compose(withAuthStatic, withRouter, withFirebase)(Navigation);