import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withAuthStatic } from "../firebase/Session";
import { compose } from "recompose";
import axios from "axios";
import { Table, Loader, Header } from "semantic-ui-react";
import { BACKEND, STORY_VIEW, LIST_CHARACTERS } from "../../constants/routes";

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

        if (!!this.props.userInfo)
        {
            axios.post(`${BACKEND}${LIST_CHARACTERS}`, { token: localStorage.getItem("token") })
                .then(res =>
                {
                    const chars = res.data.characters;
                    if (chars.length === 0)
                        this.setState({ characterList: null });
                    else
                        this.setState({ characterList: res.data.characters, selectedCharacter: res.data.characters[0]._id });
                })
                .catch(error =>
                {
                    console.log(error);
                });
        }
    }

    goToLink = to =>
    {
        this.props.history.push(to);
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
                            <Table attached fixed>
                                <Table.Body>
                                    <Table.Row textAlign="center">
                                        {
                                            story.genres.map((genre, index) =>
                                                (
                                                    <Table.Cell key={index}>{genre.name}</Table.Cell>
                                                ))
                                        }
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <Table attached><Table.Body>
                                <Table.Row>
                                    <Table.Cell><center>{story.description}</center></Table.Cell>
                                </Table.Row>
                            </Table.Body></Table>
                            <Table attached="bottom" className="linkable"><Table.Body>
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

export default compose(withRouter, withAuthStatic)(StoryView);