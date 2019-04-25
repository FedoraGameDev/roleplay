import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withAuthStatic } from "../firebase/Session";
import { compose } from "recompose";
import axios from "axios";
import { Table, Loader, Header, Modal, Button, Icon, Card, Container } from "semantic-ui-react";
import { BACKEND, STORY_VIEW, LIST_CHARACTERS, CHAPTER_VIEW, APPLY_CHARACTER, DENY_CHARACTER, ACCEPT_CHARACTER } from "../../constants/routes";
import { makeCancelable } from "../../constants/extensions";
import { CharacterGrid, CharacterCard } from "../Character";
import ChapterForm from "./ChapterForm";

const INITIAL_STATE = {
    story: {
        _id: "",
        author: {},
        chapters: [],
        characters: [],
        description: "",
        genres: [],
        subscribers: [],
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

    onCharacterApplyClick = character =>
    {
        axios.post(`${BACKEND}${APPLY_CHARACTER}`, { token: localStorage.token, character_id: character._id, story_id: this.props.match.params.story_id })
            .then(res =>
            {
                switch (res.data.status)
                {
                    case "applied":
                        console.log(res.data.message);
                        this.addToApplicants(character);
                        break;
                    case "added":
                        console.log(res.data.message);
                        this.addToRosterFree(character);
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

    onAccept = (event, character) =>
    {
        event.stopPropagation();

        axios.post(`${BACKEND}${ACCEPT_CHARACTER}`, { token: localStorage.token, character_id: character._id, story_id: this.state.story._id })
            .then(res =>
            {
                this.addToRoster(character);
                this.removeFromApplicants(character);
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    onDeny = (event, character) =>
    {
        event.stopPropagation();

        axios.post(`${BACKEND}${DENY_CHARACTER}`, { token: localStorage.token, character_id: character._id, story_id: this.state.story._id })
            .then(res =>
            {
                this.removeFromApplicants(character);
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    addToApplicants = character =>
    {
        let story = { ...this.state.story };
        let newApplicants = story.applicantcharacters ? story.applicantcharacters : [];
        newApplicants.splice(newApplicants.length, 0, character);
        story.applicantcharacters = newApplicants;
        this.setState({ story: story });
    }

    addToRosterFree = character =>
    {
        let story = { ...this.state.story };
        let newRoster = story.characters ? story.characters : [];
        newRoster.splice(newRoster.length, 0, character);
        story.characters = newRoster;
        this.setState({ story: story });
    }

    addToRoster = character =>
    {
        let story = { ...this.state.story };
        let newRoster = story.characters ? story.characters : [];

        newRoster.splice(newRoster.length, 0, character);
        story.characters = newRoster;
        this.setState({ story: story });
    }

    removeFromApplicants = character =>
    {
        let story = { ...this.state.story };
        let newApplicants = story.applicantcharacters;
        let applicantIndex = -1;

        for (let i = 0; i < newApplicants.length; i++)
        {
            if (newApplicants[i]._id === character._id)
            {
                applicantIndex = i;
                break;
            }
        }

        newApplicants.splice(applicantIndex, 1);
        story.applicantcharacters = newApplicants;
        this.setState({ story: story });
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
                                            [
                                                <Modal key={0} trigger={<Button primary><Icon name="bookmark" />Add Chapter</Button>}>
                                                    <Modal.Header>New Chapter</Modal.Header>
                                                    <Modal.Content>
                                                        <ChapterForm />
                                                    </Modal.Content>
                                                </Modal>,
                                                <Modal key={1} trigger={<Button primary><Icon name="address book" />Applicants</Button>}>
                                                    <Modal.Header>Applicants</Modal.Header>
                                                    <Modal.Content>
                                                        <Container className="character-grid">
                                                            <Card.Group centered>
                                                                {
                                                                    story.applicantcharacters.map((character, index) =>
                                                                        (
                                                                            <CharacterCard key={index} character={character} actionButtons={
                                                                                <Button.Group>
                                                                                    <Button key={0} icon color="blue" onClick={event => this.onAccept(event, character)}>
                                                                                        <Icon name="check" />
                                                                                    </Button>
                                                                                    <Button key={1} icon color="red" onClick={event => this.onDeny(event, character)}>
                                                                                        <Icon name="close" />
                                                                                    </Button>
                                                                                </Button.Group>} />
                                                                        ))
                                                                }
                                                            </Card.Group>
                                                        </Container>
                                                    </Modal.Content>
                                                </Modal>
                                            ]
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