import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../../constants/routes";
import Axios from "axios";

const withAuthStatic = () => Component =>
{
    class WithAuthStatic extends React.Component
    {
        componentDidMount()
        {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser =>
                {
                    if (authUser)
                    {
                        this.props.firebase.auth.currentUser.getIdToken(true)
                            .then(token =>
                            {
                                Axios.post(`${ROUTES.BACKEND}/user`, { token: token })
                                    .then(user =>
                                    {
                                        const userInfo = {
                                            authUser: authUser,
                                            user: user
                                        }
                                    })
                                    .catch(error =>
                                    {
                                        console.log(error);
                                    });
                            })
                            .catch(error =>
                            {
                                console.log(error);
                            });
                    }
                }
            );
        }

        componentWillUnmount()
        {
            this.listener();
        }

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