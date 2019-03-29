import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CreateStoryLink } from "./CreateStory";
import { BACKEND, STORY_VIEW } from "../../constants/routes";

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
                <li key={index}><Link to={`${STORY_VIEW.replace(":story_id", story._id)}`}>{story.title}</Link></li>
            ));

        return (<ul>{storyItems}</ul>);
    }

    render()
    {
        return ([
            <h1 key="0">Hello!</h1>,
            <this.listStories key="1" state={this.state} />,
            <CreateStoryLink key="2" />
        ]);
    }
}

export default Genre;