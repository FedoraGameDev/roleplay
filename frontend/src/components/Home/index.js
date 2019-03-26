import React from "react";
import { withAuthorization } from "../firebase/Session";
import axios from "axios";

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props);

        this.props.firebase.auth.currentUser.getIdToken(true)
            .then(idToken =>
            {
                axios.post("http://localhost:3001/user", { token: idToken })
                    .then(res =>
                    {
                        console.log(res);
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

    render()
    {
        return (
            <div>
                <h1>Home Page</h1>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);