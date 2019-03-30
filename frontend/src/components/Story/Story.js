import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CreateStoryLink } from "./CreateStory";
import { BACKEND, GENRE } from "../../constants/routes";

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
            <li key={index}><Link to={`${GENRE.replace(":genre", genre.name)}`}>{genre.name}</Link></li>
        );

        return <ul>{listItems}</ul>;
    }

    render()
    {
        return ([
            <this.genreList key="1" state={this.state} />,
            <CreateStoryLink key="2" />
        ]);
    }
}

export default Story;