import React from "react";
import { withAuthorization } from "../firebase/Session";
import axios from "axios";

class HomePage extends React.Component
{
    constructor(props)
    {
        super(props);

        axios.post("http://localhost:3001/user", { token: localStorage.token })
            .then(res =>
            {
                //
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