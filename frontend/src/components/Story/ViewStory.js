import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";
import axios from "axios";
import { withAuthStatic } from "../firebase/Session";
import { BACKEND, GENRE, STORY_VIEW, CREATE_CHAPTER } from "../../constants/routes";

const INITIAL_STATE = {
    story: {
        author: {},
        genres: [],
        chapters: []
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
        axios.get(`${BACKEND}${STORY_VIEW.replace(":story_id", this.props.match.params.story_id)}`)
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

    listChapters(chapters)
    {
        const chapterList = chapters.chapters.map((chapter, index) => (
            <li key={index}>{chapter.title}</li>
        ));

        return (
            <ul>{chapterList}</ul>
        );
    }

    render()
    {
        const { story } = this.state;

        return (
            <Container>
                <div>{story.author.username}</div>
                <div><this.listGenres genres={story.genres} /></div>
                <div>{story.title}</div>
                <div>{story.description}</div>
                <div><this.listChapters chapters={story.chapters} /></div>
                {!!this.props.userInfo && this.props.userInfo.user.username === story.author.username ?
                    <Link to={`${CREATE_CHAPTER.replace(":story_id", this.props.match.params.story_id)}`}>Create Chapter</Link> :
                    null
                }
            </Container>
        );
    }
}

export default withAuthStatic(ViewStory);