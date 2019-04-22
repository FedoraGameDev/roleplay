import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../../constants/routes";
import Axios from "axios";
import { makeCancelable } from "../../../constants/extensions";

const withAuthorization = (condition, badCheck, renderAnyways = false) => Component =>
{
    class WithAuthorization extends React.Component
    {
        promises = [];

        componentDidMount()
        {
            this.props.firebase.auth.onAuthStateChanged(
                authUser =>
                {
                    if (authUser)
                    {
                        this.props.firebase.auth.currentUser.getIdToken(true)
                            .then(token =>
                            {
                                this.promises.splice(this.promises.length - 1, 0, makeCancelable(Axios.post(`${ROUTES.BACKEND}/user`, { token: token })
                                    .then(user =>
                                    {
                                        const userInfo = {
                                            authUser: authUser,
                                            user: user.data.data
                                        }

                                        if (!condition(userInfo)) badCheck(this.props.history);
                                    })
                                    .catch(error =>
                                    {
                                        console.log(error);
                                    })));
                            })
                            .catch(error =>
                            {
                                console.log(error);
                            });
                    }
                    else
                        if (!renderAnyways) badCheck(this.props.history);
                }
            );
        }

        componentWillUnmount()
        {
            this.promises.forEach(promise => promise.cancel());
        }

        render()
        {
            return (
                <AuthUserContext.Consumer>
                    {userInfo => condition(userInfo) ? <Component {...this.props} userInfo={userInfo} /> : null}
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;