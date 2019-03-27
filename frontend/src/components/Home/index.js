import React from "react";
import { withAuthorization } from "../firebase/Session";
import axios from "axios";
import { BACKEND } from "../../constants/routes";

const INITIAL_STATE = {
    username: null
}

class HomePage extends React.Component
{
    componentWillMount()
    {
        this.setState({ ...INITIAL_STATE });
    }

    constructor(props)
    {
        super(props);

        axios.post(`${BACKEND}/user`, { token: localStorage.token })
            .then(res =>
            {
                this.setState({ username: res.data.data.username });
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
                <p>Hello {this.state.username}</p>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);