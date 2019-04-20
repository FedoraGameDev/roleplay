import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Table, Loader, Header } from "semantic-ui-react";
import { BACKEND, STORY_VIEW } from "../../constants/routes";

const INITIAL_STATE = {
    story: {
        author: {},
        chapters: [],
        characters: [],
        description: "",
        genres: [],
        subscribers: [],
        title: ""
    },
    characterList: null,
    selectedCharacter: 0,
    loaded: false
}

class StoryView extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        axios.get(`${BACKEND}${STORY_VIEW.replace(":story_id", this.props.match.params.story_id)}`)
            .then(res =>
            {
                this.setState({ story: res.data.story, loaded: true });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    render()
    {
        const { story, loaded } = this.state;

        return (
            <div>
                {
                    (loaded) ?
                        <div>
                            <Table inverted attached="top">
                                <Table.Body>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <center><Header as="h1" inverted>{story.title}</Header></center>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            <center><Header as="h4" inverted>by {story.author.username}</Header></center>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <Table attached>
                                <Table.Body>
                                    {/* <this.listGenres genres={story.genres} /> */}
                                    <Table.Row textAlign="center">
                                        {
                                            story.genres.map((genre, index) =>
                                                (
                                                    <Table.Cell key={index}>{genre.name}</Table.Cell>
                                                ))
                                        }
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell><center>{story.description}</center></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <Table attached className="linkable"><Table.Body>
                                {/* <this.listChapters info={{ myself: this, props: this.props, state: this.state, onLinkClick: this.onLinkClick }} /> */}
                                {
                                    story.chapters.map((chapter, index) =>
                                        (
                                            <Table.Row key={index}>
                                                <Table.Cell>{chapter.title}</Table.Cell>
                                                <Table.Cell>{chapter.description}</Table.Cell>
                                            </Table.Row>
                                        ))
                                }
                            </Table.Body></Table>
                        </div>
                        :
                        <Loader active />
                }
            </div>
        );
    }
}

export default withRouter(StoryView);