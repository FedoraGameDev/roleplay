import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { compose } from "recompose";
import { withAuthStatic } from "../firebase/Session";
import { STORY_VIEW, BACKEND } from "../../constants/routes";

const INITIAL_STATE = {
    story: {
        _id: "",
        author: {},
        genres: [],
        chapters: []
    },
    chapter: {
        title: "",
        description: ""
    }
}

class CreateChapter extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event =>
    {
        const newChapter = this.state.chapter;
        newChapter[event.target.name] = event.target.value;
        this.setState({ chapter: newChapter });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        const { story, chapter } = this.state;

        axios.post(`${BACKEND}/story/add_chapter/${this.props.match.params.story_id}`, {
            token: localStorage.getItem("token"),
            story: story,
            chapter: chapter
        })
            .then(updatedStory =>
            {
                this.props.history.push(STORY_VIEW.replace(":story_id", story._id));
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    componentWillMount()
    {
        axios.get(`${BACKEND}${STORY_VIEW.replace(":story_id", this.props.match.params.story_id)}`)
            .then(res =>
            {
                this.setState({ story: res.data.story });
                if (this.props.userInfo.user.username !== this.state.story.author.username)
                    this.props.history.push(`${STORY_VIEW.replace(":story_id", this.props.match.params.story_id)}`);
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
                {(!!this.state.story.author) ?
                    <form onSubmit={this.onSubmit}>
                        <input type="text" onChange={this.onChange} name="title" value={this.state.chapter.title} placeholder="title" />
                        <textarea onChange={this.onChange} name="description" value={this.state.chapter.description} placeholder="description" />
                        <button type="submit">Create Chapter</button>
                    </form> :
                    <div>Loading...</div>}
            </div>
        );
    }
}

export default compose(withRouter, withAuthStatic)(CreateChapter);