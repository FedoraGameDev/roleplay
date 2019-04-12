import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { compose } from "recompose";
import SignOutButton from "../firebase/SignOut";
import { withAuthStatic } from "../firebase/Session";
import * as ROUTES from "../../constants/routes";

class Navigation extends React.Component
{
    RenderNavigation(myself)
    {
        const { props } = myself.myself;
        const { userInfo } = props;
        if (!!userInfo)
        {
            return (
                <Menu inverted>
                    <Link to={ROUTES.HOME}><Menu.Item >Home</Menu.Item></Link>
                    <Link to={ROUTES.ACCOUNT}><Menu.Item >Account</Menu.Item></Link>
                    <Link to={ROUTES.LIST_STORY}><Menu.Item >Stories</Menu.Item></Link>
                    <Link to={ROUTES.LIST_CHARACTERS}><Menu.Item >Characters</Menu.Item></Link>
                    <Menu.Item><SignOutButton /></Menu.Item>
                </Menu>
            );
        }
        else
        {
            return (
                <Menu inverted>
                    <Link to={ROUTES.LANDING}><Menu.Item>Landing</Menu.Item></Link>
                    <Link to={ROUTES.SIGN_IN}><Menu.Item>Sign In</Menu.Item></Link>
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

export default compose(withAuthStatic, withRouter)(Navigation);