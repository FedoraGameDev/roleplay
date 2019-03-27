import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND, CREATE_STORY } from "../../constants/routes";
import { withAuthorization } from "../firebase/Session";

const INITIAL_STATE = {
    genres: []
}

class CreateStory extends Component
{
    render()
    {
        return (
            <h1>Hello!</h1>
        );
    }
}

const CreateStoryLink = () =>
    (
        <p><Link to={CREATE_STORY}>New Story</Link></p>
    )

const condition = authUser => !!authUser;

export default withAuthorization(condition)(CreateStory);
export { CreateStoryLink };