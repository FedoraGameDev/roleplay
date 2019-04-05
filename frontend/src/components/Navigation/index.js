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
        if (!!myself.myself.props.userInfo)
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
                <ul>
                    <li><Link to={ROUTES.LANDING}>Landing</Link></li>
                    <li><Link to={ROUTES.SIGN_IN}>Sign In</Link></li>
                </ul>
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