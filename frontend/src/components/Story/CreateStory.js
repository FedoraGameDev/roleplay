import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Button } from "semantic-ui-react";
import { compose } from "recompose";
import { BACKEND, CREATE_STORY, STORY_VIEW, SIGN_IN } from "../../constants/routes";
import { withAuthorization } from "../firebase/Session";

const INITIAL_STATE = {
    title: "",
    description: "",
    closed_group: false,
    genres: [],
    genresSelection: {},
    error: null
}

class CreateStory extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
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

    onGenreChecked = event =>
    {
        const newSel = this.state.genresSelection;
        newSel[`${event.target.name}`] = event.target.checked;
        this.setState({ genresSelection: newSel });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        const { title, description, closed_group, genresSelection } = this.state;
        const genres = [];

        for (var key in genresSelection)
        {
            if (genresSelection[key])
                genres.splice(genres.length - 1, 0, key);
        }

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
            this.props.history.push(STORY_VIEW.replace(":story_id", res.data.newStory._id));
        }).catch(error =>
        {
            this.setState({ error: error });
        });
    }

    renderGenres(myself)
    {
        const allGenres = myself.this.state.genres.map((genre, index) => (
            <li key={index}>
                <input type="checkbox" onChange={myself.this.onGenreChecked} name={genre.name} />
                <label>{genre.name}</label>
            </li>
        ));
        return (
            <ul>{allGenres}</ul>
        );
    }

    render()
    {
        const { title, description, closed_group, error } = this.state;

        const isInvalid = (title === "" || description === "");

        return (
            <form onSubmit={this.onSubmit}>
                <input type="text" onChange={this.onChange} name="title" value={title} placeholder="title" />
                <textarea onChange={this.onChange} name="description" value={description} placeholder="description" />
                <input type="checkbox" onChange={this.onChange} name="closed_group" value={closed_group} />
                <this.renderGenres this={this} />
                <button disabled={isInvalid} type="submit">Create</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

class CreateStoryLinkBase extends Component
{
    Click = to =>
    {
        this.props.history.push(to);
    }

    render()
    {
        return (
            <Button primary onClick={event => this.Click(CREATE_STORY)}>New Story</Button>
        );
    }
}

const CreateStoryLink = withRouter(CreateStoryLinkBase);

export default compose(withRouter, withAuthorization(userInfo => !!userInfo, history => history.push(`${SIGN_IN}?forward=story/create`)))(CreateStory);
export { CreateStoryLink };