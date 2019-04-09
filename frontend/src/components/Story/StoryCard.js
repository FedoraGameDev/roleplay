import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { STORY_VIEW } from "../../constants/routes";

class StoryCard extends Component
{
    render()
    {
        const { story } = this.props;
        return (
            <Table.Row>
                <Table.Cell width={10}>
                    <Link to={STORY_VIEW.replace(":story_id", story._id)}>
                        {story.title}
                    </Link>
                </Table.Cell>
                <Table.Cell width={1}><center>
                    4/8/19
                </center></Table.Cell>
                <Table.Cell width={1}><center>
                    4
                </center></Table.Cell>
                <Table.Cell width={2}><center>
                    {story.author.username}
                </center></Table.Cell>
            </Table.Row>
        );
    }
}

class StoryTable extends Component
{
    TableCards = (stories) =>
    {
        const rows = stories.stories.map((story, index) =>
            (
                <StoryCard key={index} story={story} />
            ));

        return (
            <div>
                <Table inverted attached="top">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={10}>Title</Table.HeaderCell>
                            <Table.HeaderCell width={1}><center>Date Created</center></Table.HeaderCell>
                            <Table.HeaderCell width={1}><center>Post Count</center></Table.HeaderCell>
                            <Table.HeaderCell width={2}><center>Author</center></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                </Table>
                <Table attached striped>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            </div>
        );
    }

    render()
    {
        return (
            <this.TableCards stories={this.props.stories} />
        );
    }
}

export default StoryCard;
export { StoryTable };