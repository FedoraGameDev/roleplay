import React from "react";
import { withRouter } from "react-router-dom";
import NavLinkContext from "./context";

const withNavLink = () => Component =>
{
    class WithNavLink extends React.Component
    {
        render()
        {
            return (
                <NavLinkContext.Consumer>
                    {navlink => <Component {...this.props} navlink={navlink} />}
                </NavLinkContext.Consumer>
            );
        }
    }

    return withRouter(WithNavLink);
}

export default withNavLink;