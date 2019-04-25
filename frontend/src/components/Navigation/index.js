import React from "react";
import { withRouter } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import { compose } from "recompose";
import { withFirebase } from "../firebase/Firebase";
import { withAuthStatic } from "../firebase/Session";
import * as ROUTES from "../../constants/routes";

class Navigation extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            menuTarget: "home"
        };
    }

    componentDidMount()
    {
        this.setTarget(this.props.location.pathname);

        this.backListener = this.props.history.listen(location =>
        {
            this.setTarget(location.pathname);
        });
    }

    componentWillUnmount()
    {
        this.backListener();
    }

    setTarget = (to) =>
    {
        if (to.includes("home")) this.setState({ menuTarget: "home" });
        if (to.includes("account")) this.setState({ menuTarget: "account" });
        if (to.includes("story")) this.setState({ menuTarget: "story" });
        if (to.includes("character")) this.setState({ menuTarget: "character" });
        if (to === "/") this.setState({ menuTarget: "landing" });
        if (to.includes("signin")) this.setState({ menuTarget: "signin" });
    }

    render()
    {
        const { props, state } = this;
        const { userInfo, history, firebase } = props;
        const { menuTarget } = state;

        const loggedInItems = [
            { activeLink: "home", route: ROUTES.HOME, title: "Home", icon: "home" },
            { activeLink: "account", route: ROUTES.ACCOUNT, title: "Account", icon: "user" },
            { activeLink: "story", route: ROUTES.LIST_STORY, title: "Stories", icon: "book" },
            { activeLink: "character", route: ROUTES.LIST_CHARACTERS, title: "Characters", icon: "user secret" }
        ];

        const loggedOutItems = [
            { activeLink: "landing", route: ROUTES.LANDING, title: "Home", icon: "home" },
            { activeLink: "story", route: ROUTES.LIST_STORY, title: "Stories", icon: "book" },
            { activeLink: "signin", route: ROUTES.SIGN_IN, title: "Sign In", icon: "sign in alternate" }
        ];

        return (
            <Menu inverted pointing secondary>
                {
                    !!userInfo ?
                        [
                            loggedInItems.map((item, index) =>
                                (
                                    <Menu.Item
                                        color="blue"
                                        key={index}
                                        active={menuTarget === item.activeLink}
                                        onClick={() => { history.push(item.route) }}>
                                        <Icon name={item.icon} size="large" color={menuTarget === item.activeLink ? "blue" : null} />
                                        <div>{item.title}</div>
                                    </Menu.Item>
                                )),
                            <Menu.Item key={loggedInItems.length} onClick={event => { firebase.doSignOut(); history.push("/"); }} >
                                <Icon name="sign out alternate" size="large" />
                                Log Out
                            </Menu.Item>,
                            <Menu.Item key={loggedInItems.length + 1} onClick={event => { window.open("https://github.com/FedoraGameDev/roleplay/issues/new", "_blank").focus(); }}>
                                <Icon name="bug" size="large" />
                                Report a Bug
                            </Menu.Item>
                        ]
                        :
                        loggedOutItems.map((item, index) =>
                            (
                                <Menu.Item
                                    color="blue"
                                    key={index}
                                    active={menuTarget === item.activeLink}
                                    onClick={() => { history.push(item.route) }}>
                                    <Icon name={item.icon} size="large" color={menuTarget === item.activeLink ? "blue" : null} />
                                    <div>{item.title}</div>
                                </Menu.Item>
                            ))
                }
            </Menu>
        );
    }
}

export default compose(withAuthStatic, withRouter, withFirebase)(Navigation);