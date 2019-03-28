import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { compose } from "recompose";
import { BACKEND, CREATE_STORY, STORY_VIEW } from "../../constants/routes";
import { withAuthorization } from "../firebase/Session";

const INITIAL_STATE = {
    title: "",
    description: "",
    closed_group: false,
    genres: [],
    error: null
}

class CreateStory extends Component
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

    onChange = event =>
    {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit = event =>
    {
        const { title, description, closed_group, genres, error } = this.state;

        axios.post(`${BACKEND}/story/create`, {
            token: localStorage.getItem("token"),
            story:
            {
                title: title,
                description: description,
                closed_group: closed_group,
                genres: genres
            }
        }).then(res =>
        {
            console.log(res.data);
            this.props.history.push(STORY_VIEW.replace(":story_id", res.data.newStory._id));
        }).catch(error =>
        {
            this.setState({ error: error });
        });

        event.preventDefault();
    }

    renderGenres(myself)
    {
        console.log(myself.this.state.genres);
        const allGenres = myself.this.state.genres.map((genre, index) => (
            <li key={index}>
                <input type="checkbox" onChange={myself.this.onChange} name={genre.name} />
                <label>{genre.name}</label>
            </li>
        ));
        return (
            <ul>{allGenres}</ul>
        );
    }

    render()
    {
        const { title, description, closed_group, genres, error } = this.state;

        const isInvalid = (title === "" || description === "");

        return (
            <form onSubmit={this.onSubmit}>
                <input type="text" onChange={this.onChange} name="title" value={title} />
                <textarea onChange={this.onChange} name="description" value={description} />
                <input type="checkbox" onChange={this.onChange} name="closed_group" value={closed_group} />
                <this.renderGenres this={this} />
                <button disabled={isInvalid} type="submit">Create</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const CreateStoryLink = () =>
    (
        <p><Link to={CREATE_STORY}>New Story</Link></p>
    )

export default compose(withRouter, withAuthorization(authUser => !!authUser))(CreateStory);
export { CreateStoryLink };