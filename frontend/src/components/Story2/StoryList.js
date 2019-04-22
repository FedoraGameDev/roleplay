import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Book from "./Book";
import { Card, Table, Placeholder } from "semantic-ui-react";
import { STORY_VIEW } from "../../constants/routes";

class StoryList extends Component
{
    /* render
     * Display a list of stories based on property 'stories'
    */
    render()
    {
        const { stories } = this.props;

        return (
            <Card.Group centered>
                {
                    stories.map((story, index) =>
                        (
                            <Book key={index} story={story} color="#2185d0" />
                        ))
                }
            </Card.Group>
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