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









{/*
<Table key={0} inverted attached="top">
    <Table.Header>
        <Table.Row>
            <Table.HeaderCell width={10}>Title</Table.HeaderCell>
            <Table.HeaderCell width={1} textAlign="center">Date Created</Table.HeaderCell>
            <Table.HeaderCell width={1} textAlign="center">Post Count</Table.HeaderCell>
            <Table.HeaderCell width={2} textAlign="center">Author</Table.HeaderCell>
        </Table.Row>
    </Table.Header>
</Table>
<Table key={1} attached="bottom" striped className="linkable">
    {!!stories ?
        <Table.Body>
            {
                stories.map((story, index) =>
                {
                    const date = new Date(story.date_created);
                    const dateCreated = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

                    return (
                        <Table.Row key={index} onClick={() => { this.goToPage(STORY_VIEW.replace(":story_id", story._id)); }}>
                            <Table.Cell width={10}>{story.title}</Table.Cell>
                            <Table.Cell width={1} textAlign="center">{dateCreated}</Table.Cell>
                            <Table.Cell width={1} textAlign="center">{story.replies}</Table.Cell>
                            <Table.Cell width={2} textAlign="center">{story.author.username}</Table.Cell>
                        </Table.Row>
                    );
                })
            }
        </Table.Body>
        :
        <Table.Body><Table.Row>
            <Table.Cell width={10}>
                <Placeholder fluid>
                    <Placeholder.Header>
                        <Placeholder.Line />
                    </Placeholder.Header>
                </Placeholder>
            </Table.Cell>
            <Table.Cell width={1}>
                <Placeholder fluid>
                    <Placeholder.Header>
                        <Placeholder.Line />
                    </Placeholder.Header>
                </Placeholder>
            </Table.Cell>
            <Table.Cell width={1}>
                <Placeholder fluid>
                    <Placeholder.Header>
                        <Placeholder.Line />
                    </Placeholder.Header>
                </Placeholder>
            </Table.Cell>
            <Table.Cell width={2}>
                <Placeholder fluid>
                    <Placeholder.Header>
                        <Placeholder.Line />
                    </Placeholder.Header>
                </Placeholder>
            </Table.Cell>
        </Table.Row></Table.Body>
    }
</Table>
*/}