import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND, GENRENew_Genre, GENRE } from "../../constants/routes";

const INITIAL_STATE = {
    story: {
        author: "",
        genres: []
    }
}

class ViewStory extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
    {
        axios.get(`${BACKEND}/story/view/${this.props.match.params.story_id}`)
            .then(res =>
            {
                this.setState({ story: res.data.story });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    listGenres(genres)
    {
        const genreList = genres.genres.map((genre, index) => (
            <li key={index}><Link to={GENRE.replace(":genre", genre.name)}>{genre.name}</Link></li>
        ));

        return (
            <ul>{genreList}</ul>
        )
    }

    render()
    {
        const { story } = this.state;
        return (
            <div>
                <div>{story.author.username}</div>
                <div><this.listGenres genres={story.genres} /></div>
                <div>{story.title}</div>
                <div>{story.description}</div>
            </div>
        );
    }
}

export default ViewStory;