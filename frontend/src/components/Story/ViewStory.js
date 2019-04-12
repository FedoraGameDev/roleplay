import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Container, Table, Header, Button, Modal, ModalDescription, Dropdown } from "semantic-ui-react";
import { compose } from "recompose";
import axios from "axios";
import { withAuthStatic } from "../firebase/Session";
import { BACKEND, STORY_VIEW, CREATE_CHAPTER, LIST_CHARACTERS, CHAPTER_VIEW } from "../../constants/routes";

const INITIAL_STATE = {
    story: {
        author: {},
        genres: [],
        chapters: []
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
        axios.get(`${BACKEND}${STORY_VIEW.replace(":story_id", this.props.match.params.story_id)}`)
            .then(res =>
            {
                this.setState({ story: res.data.story });
            })
            .catch(error =>
            {
                console.log(error);
            });

        axios.post(`${BACKEND}${LIST_CHARACTERS}`, { token: localStorage.getItem("token") })
            .then(res =>
            {
                this.setState({ characterList: res.data.characters });
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
        const { characters, state } = info.info;
        const options = characters.map((character, index) =>
            (
                <Dropdown.Item key={index}>{character.name}</Dropdown.Item>
            ));

        return (<Dropdown placeholder="Characters" scrolling value={state.selectedCharacter}><Dropdown.Menu>{options}</Dropdown.Menu></Dropdown>);
    }

    onLinkClick = to =>
    {
        this.props.history.push(to);
    }

    listChapters(info)
    {
        const { myself, onLinkClick } = info.info;
        const { props, state } = myself;
        const { story, characterList } = state;
        const { chapters } = story;
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
                    <Modal trigger={<Button secondary>Add Character</Button>}>
                        <Modal.Header>Choose your character</Modal.Header>
                        <Modal.Content>
                            <ModalDescription>
                                {!!characterList ?
                                    <myself.listCharacterOptions info={{ characters: characterList, state: state }} /> :
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