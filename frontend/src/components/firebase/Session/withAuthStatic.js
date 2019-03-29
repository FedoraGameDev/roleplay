import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthStatic = Component =>
{
    class WithAuthStatic extends React.Component
    {
        render()
        {
            return (
                <AuthUserContext.Consumer>
                    {userInfo => <Component {...this.props} userInfo={userInfo} />}
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(withRouter, withFirebase)(WithAuthStatic);
};

export default withAuthStatic;