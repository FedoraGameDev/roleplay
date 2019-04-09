import React from "react";
import axios from "axios";
import { Loader } from "semantic-ui-react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";
import { BACKEND } from "../../../constants/routes";

const withAuthentication = Component =>
{
    class WithAuthentication extends React.Component
    {
        constructor(props)
        {
            super(props);
            this.state = {
                userInfo: null,
                checkedAuth: false
            };
        }

        componentDidMount()
        {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser =>
                {
                    if (authUser)
                    {
                        this.props.firebase.auth.currentUser.getIdToken(true)
                            .then(idToken =>
                            {
                                axios.post(`${BACKEND}/user`, { token: idToken })
                                    .then(user =>
                                    {
                                        this.setState({
                                            userInfo: {
                                                authUser: authUser,
                                                user: user.data.data
                                            },
                                            checkedAuth: true
                                        });
                                        localStorage.setItem("token", idToken);
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
                    else
                    {
                        this.setState({ userInfo: null, checkedAuth: true });
                        localStorage.setItem("token", null);
                    };
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
                <AuthUserContext.Provider value={this.state.userInfo}>
                    {(this.state.checkedAuth) ? <Component {...this.props} /> : <Loader active />}
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

export default withAuthentication;