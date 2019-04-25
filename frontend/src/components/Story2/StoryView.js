import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withAuthStatic } from "../firebase/Session";
import { compose } from "recompose";
import axios from "axios";
import { Table, Loader, Header, Modal, Button, Icon } from "semantic-ui-react";
import { BACKEND, STORY_VIEW, LIST_CHARACTERS, CHAPTER_VIEW, APPLY_CHARACTER } from "../../constants/routes";
import { makeCancelable } from "../../constants/extensions";
import { CharacterGrid } from "../Character";

const INITIAL_STATE = {
    story: {
        author: {},
        chapters: [],
        characters: [],
        description: "",
        genres: [],
        subscribers: [],
        applicantusers: [],
        applicantcharacters: [],
        title: ""
    },
    characterList: null,
    loadedStory: false,
    loadedCharacters: false
}

/* StoryView
 * Displays all info from a single story listing its chapters.
*/
class StoryView extends Component
{
    promises = [];

    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        this.promises.splice(this.promises.length - 1, 0, makeCancelable(axios.get(`${BACKEND}${STORY_VIEW.replace(":story_id", this.props.match.params.story_id)}`)
            .then(res =>
            {
                this.setState({ story: res.data.story, loadedStory: true });
            })
            .catch(error =>
            {
                console.log(error);
            })));

        if (!!this.props.userInfo)
        {
            this.promises.splice(this.promises.length - 1, 0, makeCancelable(axios.post(`${BACKEND}${LIST_CHARACTERS}`, { token: localStorage.getItem("token") })
                .then(res =>
                {
                    const chars = res.data.characters;
                    if (chars.length === 0)
                        this.setState({ characterList: null, loadedCharacters: true });
                    else
                        this.setState({ characterList: res.data.characters, loadedCharacters: true });
                })
                .catch(error =>
                {
                    console.log(error);
                })));
        }
    }

    componentWillUnmount()
    {
        this.promises.forEach(promise => { promise.cancel(); });
    }

    goToLink = to =>
    {
        this.props.history.push(to);
    }

    onCharacterApplyClick = characterId =>
    {
        axios.post(`${BACKEND}${APPLY_CHARACTER}`, { token: localStorage.token, character_id: characterId, story_id: this.state.story._id })
            .then(res =>
            {
                switch (res.data.status)
                {
                    case "applied":
                        console.log(res.data.message);
                        break;
                    case "added":
                        console.log(res.data.message);
                        break;
                    case "error":
                        console.log(res.data.message);
                        break;

                    default:
                        console.log(`Server responded with an unknown status "${res.data.status}"`);
                        break;
                }
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    render()
    {
        const { story, characterList, loadedStory, loadedCharacters } = this.state;
        const { userInfo } = this.props;
        const isCreator = (!!userInfo && userInfo.user.username === story.author.username);

        return (
            <div>
                {
                    loadedStory ?
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
                            <Table attached><Table.Body>
                                <Table.Row><Table.Cell>
                                    {
                                        isCreator ?
                                            <Modal trigger={<Button primary><Icon name="bookmark" />Add Chapter</Button>}>
                                                <Modal.Header>New Chapter</Modal.Header>
                                                <Modal.Content>
                                                    {null}
                                                </Modal.Content>
                                            </Modal>
                                            :
                                            null
                                    }
                                    <Modal trigger={<Button secondary><Icon name="spy" />Roster</Button>}>
                                        <Modal.Header>Character Roster</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                {!!story.characters ?
                                                    <CharacterGrid characters={story.characters} /> :
                                                    <div>Loading...</div>}
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                    {
                                        loadedCharacters ?
                                            <Modal trigger={
                                                <Button secondary>
                                                    {
                                                        story.closed_group ?
                                                            <span><Icon name="lock" />Apply</span>
                                                            :
                                                            <span><Icon name="lock open" />Join</span>
                                                    }
                                                </Button>
                                            }>
                                                <Modal.Header>{story.closed_group ? "Apply Character" : "Add Character to Roster"}</Modal.Header>
                                                <Modal.Content>
                                                    <CharacterGrid characters={characterList} onClick={this.onCharacterApplyClick} />
                                                </Modal.Content>
                                            </Modal>
                                            :
                                            null
                                    }
                                </Table.Cell></Table.Row>
                            </Table.Body></Table>
                            <Table attached="bottom" className="linkable"><Table.Body>
                                {
                                    story.chapters.map((chapter, index) =>
                                        (
                                            <Table.Row key={index} onClick={() => { this.goToLink(CHAPTER_VIEW.replace(":story_id", story._id).replace(":chapter_name", index)) }}>
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