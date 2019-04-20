import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Table, Placeholder } from "semantic-ui-react";
import { STORY_VIEW } from "../../constants/routes";

class StoryList extends Component
{
    /* goToPage
     * Open link 'to'
    */
    goToPage = (to) =>
    {
        this.props.history.push(to);
    }

    /* render
     * Display a list of stories based on property 'stories'
    */
    render()
    {
        const { stories } = this.props;

        return (
            <div>
                <Table key={0} inverted attached="top">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={10}>Title</Table.HeaderCell>
                            <Table.HeaderCell width={1}><center>Date Created</center></Table.HeaderCell>
                            <Table.HeaderCell width={1}><center>Post Count</center></Table.HeaderCell>
                            <Table.HeaderCell width={2}><center>Author</center></Table.HeaderCell>
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
                                            <Table.Cell width={1}>{dateCreated}</Table.Cell>
                                            <Table.Cell width={1}>{story.replies}</Table.Cell>
                                            <Table.Cell width={2}>{story.author.username}</Table.Cell>
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
            </div>
        );
    }
}

export default withRouter(StoryList);