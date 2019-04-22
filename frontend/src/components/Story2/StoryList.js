import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Book from "./Book";
import { Card, Button, Modal } from "semantic-ui-react";
import StoryForm from "./StoryForm";
import { BACKEND, STORY_VIEW } from "../../constants/routes";

class StoryList extends Component
{
    onStoryCreateSubmit = story =>
    {
        console.log(story);

        axios.post(`${BACKEND}/story/create`, {
            token: localStorage.getItem("token"),
            story: story
        }).then(res =>
        {
            this.props.history.push(STORY_VIEW.replace(":story_id", res.data.newStory._id));
        }).catch(error =>
        {
            this.setState({ error: error });
        });
    }

    /* render
     * Display a list of stories based on property 'stories'
    */
    render()
    {
        const { stories, genres } = this.props;

        return (
            <div>
                <Modal trigger={<center><Button primary>New Story</Button></center>} dimmer="blurring">
                    <Modal.Header>New Story</Modal.Header>
                    <Modal.Content>
                        <StoryForm genres={genres} onStorySubmit={this.onStoryCreateSubmit} />
                    </Modal.Content>
                </Modal>

                <Card.Group centered style={{ marginTop: "5px" }}>
                    {
                        stories.map((story, index) =>
                            (
                                <Book key={index} story={story} genres={genres} />
                            ))
                    }
                </Card.Group>
            </div>
        );
    }
}

export default withRouter(StoryList);