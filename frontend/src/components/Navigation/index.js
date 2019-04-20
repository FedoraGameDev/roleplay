import React from "react";
import { Menu } from "semantic-ui-react";
import { compose } from "recompose";
import { withFirebase } from "../firebase/Firebase";
import { withAuthStatic } from "../firebase/Session";
import * as ROUTES from "../../constants/routes";
import withNavLink from "./withNavLink";

class Navigation extends React.Component
{
    componentDidMount()
    {
        this.props.navlink.setTarget(this.props.location.pathname);
    }

    render()
    {
        const { props } = this;
        const { userInfo, navlink, history, firebase } = props;

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
                                        active={navlink.menuTarget === item.activeLink}
                                        onClick={() => { navlink.goToLink(item.route, history) }}>
                                        {item.title}
                                    </Menu.Item>
                                )),
                            <Menu.Item key={loggedInItems.length} onClick={event => { firebase.doSignOut(); navlink.goToLink("/", history); }} >Log Out</Menu.Item>
                        ]
                        :
                        loggedOutItems.map((item, index) =>
                            (
                                <Menu.Item
                                    key={index}
                                    active={navlink.menuTarget === item.activeLink}
                                    onClick={() => { navlink.goToLink(item.route, history) }}>
                                    {item.title}
                                </Menu.Item>
                            ))
                }
            </Menu>
        );
    }
}

export default compose(withAuthStatic, withNavLink(), withFirebase)(Navigation);