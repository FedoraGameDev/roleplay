import React from "react";
import { withRouter } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { compose } from "recompose";
import { withFirebase } from "../firebase/Firebase";
import { withAuthStatic } from "../firebase/Session";
import * as ROUTES from "../../constants/routes";

const INITIAL_STATE = {
    menuTarget: "home"
}

class Navigation extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        if (this.props.location.pathname.includes("account")) this.setState({ menuTarget: "account" });
        if (this.props.location.pathname.includes("story")) this.setState({ menuTarget: "story" });
        if (this.props.location.pathname.includes("character")) this.setState({ menuTarget: "character" });
    }

    clickLink = (to, target) =>
    {
        this.setState({ menuTarget: target });
        this.props.history.push(to);
    }

    RenderNavigation(myself)
    {
        const { props, clickLink, state } = myself.myself;
        const { menuTarget } = state;
        const { userInfo } = props;
        if (!!userInfo)
        {
            return (
                <Menu inverted tabular attached="top">
                    <Menu.Item active={menuTarget === "home"} onClick={event => { clickLink(ROUTES.HOME, "home") }} >Home</Menu.Item>
                    <Menu.Item active={menuTarget === "account"} onClick={event => { clickLink(ROUTES.ACCOUNT, "account") }} >Account</Menu.Item>
                    <Menu.Item active={menuTarget === "story"} onClick={event => { clickLink(ROUTES.LIST_STORY, "story") }} >Stories</Menu.Item>
                    <Menu.Item active={menuTarget === "character"} onClick={event => { clickLink(ROUTES.LIST_CHARACTERS, "character") }} >Characters</Menu.Item>
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