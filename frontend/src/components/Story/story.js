import React, { Component } from "react";
import axios from "axios";
import { CreateStoryLink } from "./CreateStory";
import { BACKEND } from "../../constants/routes";

const INITIAL_STATE = {
    genres: []
}

class Story extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
    {
        axios.get(`${BACKEND}/story`)
            .then(res =>
            {
                this.setState({ genres: res.data.genres });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    genreList(state)
    {
        const listItems = state.state.genres.map((genre, index) =>
            <li key={index}>{genre.name}</li>
        );

        return <ul>{listItems}</ul>;
    }

    render()
    {
        return ([
            <h1 key="0">Hello!</h1>,
            <this.genreList key="1" state={this.state} />,
            <CreateStoryLink />
        ]);
    }
}

export default Story;