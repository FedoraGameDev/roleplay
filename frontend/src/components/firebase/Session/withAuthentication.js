import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = Component =>
{
    class WithAuthentication extends React.Component
    {
        constructor(props)
        {
            super(props);
            this.state = {
                authUser: null
            };
        }

        componentDidMount()
        {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser =>
                {
                    if (authUser)
                    {
                        this.setState({ authUser });
                        this.props.firebase.auth.currentUser.getIdToken(true)
                            .then(idToken =>
                            {
                                localStorage.setItem("token", idToken);
                            })
                            .catch(error =>
                            {
                                console.log(error);
                            });
                    }
                    else
                    {
                        this.setState({ authUser: null });
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
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

export default withAuthentication;