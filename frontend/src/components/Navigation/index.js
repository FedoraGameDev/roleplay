import React from "react";
import { withRouter } from "react-router-dom";
import { Menu } from "semantic-ui-react";
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
            { activeLink: "home", route: ROUTES.HOME, title: "Home" },
            { activeLink: "account", route: ROUTES.ACCOUNT, title: "Account" },
            { activeLink: "story", route: ROUTES.LIST_STORY, title: "Stories" },
            { activeLink: "character", route: ROUTES.LIST_CHARACTERS, title: "Characters" }
        ];

        const loggedOutItems = [
            { activeLink: "landing", route: ROUTES.LANDING, title: "Landing" },
            { activeLink: "story", route: ROUTES.LIST_STORY, title: "Stories" },
            { activeLink: "signin", route: ROUTES.SIGN_IN, title: "Sign In" }
        ];

        return (
            <Menu inverted tabular attached="top">
                {
                    !!userInfo ?
                        [
                            loggedInItems.map((item, index) =>
                                (
                                    <Menu.Item
                                        key={index}
                                        active={menuTarget === item.activeLink}
                                        onClick={() => { history.push(item.route) }}>
                                        {item.title}
                                    </Menu.Item>
                                )),
                            <Menu.Item key={loggedInItems.length} onClick={event => { firebase.doSignOut(); history.push("/"); }} >Log Out</Menu.Item>
                        ]
                        :
                        loggedOutItems.map((item, index) =>
                            (
                                <Menu.Item
                                    key={index}
                                    active={menuTarget === item.activeLink}
                                    onClick={() => { history.push(item.route) }}>
                                    {item.title}
                                </Menu.Item>
                            ))
                }
            </Menu>
        );
    }
}

export default compose(withAuthStatic, withRouter, withFirebase)(Navigation);