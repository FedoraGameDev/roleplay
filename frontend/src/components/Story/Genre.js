import React, { Component } from "react";
import axios from "axios";
import { CreateStoryLink } from "./CreateStory";
import { BACKEND } from "../../constants/routes";

const INITIAL_STATE = {
    stories: []
}

class Genre extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
    {
        axios.get(`${BACKEND}/story/${this.props.match.params.genre}`)
            .then(res =>
            {
                console.log(res);
                this.setState({ stories: res.data.stories });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    listStories(state)
    {
        let storyItems = state.state.stories.map((story, index) =>
            (
                <li key={index}>{story.title}</li>
            ));

        return (<ul>{storyItems}</ul>);
    }

    render()
    {
        return ([
            <h1>Hello!</h1>,
            <this.listStories state={this.state} />,
            <CreateStoryLink />
        ]);
    }
}

export default Genre;