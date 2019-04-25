import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Container, Table, Header, Button, Modal, ModalDescription, Form } from "semantic-ui-react";
import { compose } from "recompose";
import axios from "axios";
import { withAuthStatic } from "../firebase/Session";
import { CharacterGrid } from "../Character";
import { BACKEND, STORY_VIEW, CREATE_CHAPTER, LIST_CHARACTERS, CHAPTER_VIEW, APPLY_CHARACTER } from "../../constants/routes";

const INITIAL_STATE = {
    story: {
        author: {},
        genres: [],
        chapters: [],
        characters: []
    },
    characterList: null,
    selectedCharacter: 0
}

class ViewStory extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        this.getStory();

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

    getStory = () =>
    {
        axios.get(`${BACKEND}${STORY_VIEW.replace(":story_id", this.props.match.params.story_id)}`)
            .then(res =>
            {
                this.setState({ story: res.data.story });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    listGenres(genres)
    {
        const genreList = genres.genres.map((genre, index) => (
            <Table.Cell key={index} value={index}><center>{genre.name}</center></Table.Cell>
        ));

        return (
            <Table.Row>{genreList}</Table.Row>
        )
    }

    listCharacterOptions = info =>
    {
        const { myself } = info.info;
        const { state } = myself;
        const { characterList } = state;
        const options = characterList.map((character, index) =>
            (
                <option key={index} value={character._id}>{character.name}</option>
            ));

        return (<select placeholder="Characters" value={state.selectedCharacter} onChange={myself.onChooseCharacterChange}>{options}</select>);
    }

    onLinkClick = to =>
    {
        this.props.history.push(to);
    }

    onChooseCharacterChange = event =>
    {
        this.setState({ selectedCharacter: event.target.value });
    }

    onApplyCharacter = event =>
    {
        event.preventDefault();
        axios.post(`${BACKEND}${APPLY_CHARACTER}`,
            { token: localStorage.getItem("token"), character_id: this.state.selectedCharacter, story_id: this.state.story._id })
            .then(res =>
            {
                const { message, status } = res.data;

                alert(message);

                if (status === "added")
                {
                    this.setState({ story: INITIAL_STATE.story });
                    this.getStory();
                }
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    listChapters(info)
    {
        const { myself, onLinkClick } = info.info;
        const { props, state } = myself;
        const { story, characterList } = state;
        const { chapters, characters } = story;
        const { userInfo } = props;
        const { story_id } = props.match.params;
        const isCreator = (!!userInfo && userInfo.user.username === story.author.username);
        const chapterList = chapters.map((chapter, index) => (
            <Table.Row key={index}>
                <Table.Cell><Link to={CHAPTER_VIEW.replace(":story_id", story_id).replace(":chapter_name", index)}>{chapter.title}</Link></Table.Cell>
                <Table.Cell>{chapter.description}</Table.Cell>
            </Table.Row>
        ));

        return (
            <Table.Body>
                <Table.Row><Table.Cell>
                    {isCreator ?
                        <Button primary onClick={event => { onLinkClick(CREATE_CHAPTER.replace(":story_id", story_id)) }}>Create Chapter</Button> :
                        null
                    }
                    {!!userInfo ?
                        <Modal trigger={<Button secondary>Add Character</Button>}>
                            <Modal.Header>Choose your character</Modal.Header>
                            <Modal.Content>
                                <ModalDescription>
                                    {!!characterList ?
                                        <Form onSubmit={myself.onApplyCharacter}>
                                            <myself.listCharacterOptions info={{ myself: myself }} />
                                            <Button primary type="submit">
                                                {
                                                    story.closed_group ?
                                                        "Apply"
                                                        :
                                                        "Join"
                                                }
                                            </Button>
                                        </Form> :
                                        <div>Loading...</div>}
                                </ModalDescription>
                            </Modal.Content>
                        </Modal> :
                        null
                    }
                    <Modal trigger={<Button secondary>Roster</Button>}>
                        <Modal.Header>Character Roster</Modal.Header>
                        <Modal.Content>
                            <ModalDescription>
                                {!!characters ?
                                    <CharacterGrid characters={characters} /> :
                                    <div>Loading...</div>}
                            </ModalDescription>
                        </Modal.Content>
                    </Modal>
                </Table.Cell></Table.Row>
                {chapterList}
            </Table.Body>
        );
    }

    render()
    {
        return (
            <Container>
                <Table inverted attached="top">
                    <Table.Body>
                        <Table.Row>
                            <Table.HeaderCell>
                                <center><Header as="h1" inverted>{this.state.story.title}</Header></center>
                            </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>
                                <center><Header as="h4" inverted>by {this.state.story.author.username}</Header></center>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Table attached>
                    <Table.Body>
                        <this.listGenres genres={this.state.story.genres} />
                        <Table.Row>
                            <Table.Cell><center>{this.state.story.description}</center></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Table attached>
                    <this.listChapters info={{ myself: this, props: this.props, state: this.state, onLinkClick: this.onLinkClick }} />
                </Table>
            </Container>
        );
    }
}

export default compose(withAuthStatic, withRouter)(ViewStory);