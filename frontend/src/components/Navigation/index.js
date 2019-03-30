import React from "react";
import { Link } from "react-router-dom";
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
                <ul>
                    <li><Link to={ROUTES.LANDING}>Landing</Link></li>
                    <li><Link to={ROUTES.HOME}>Home</Link></li>
                    <li><Link to={ROUTES.ACCOUNT}>Account</Link></li>
                    <li><Link to={ROUTES.STORY}>Stories</Link></li>
                    <li><Link to={ROUTES.LIST_CHARACTERS}>Characters</Link></li>
                    <li><SignOutButton /></li>
                </ul>
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

export default withAuthStatic(Navigation);