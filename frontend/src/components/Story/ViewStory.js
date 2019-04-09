import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Table, Header, Button } from "semantic-ui-react";
import { compose } from "recompose";
import axios from "axios";
import { withAuthStatic } from "../firebase/Session";
import { BACKEND, STORY_VIEW, CREATE_CHAPTER } from "../../constants/routes";

const INITIAL_STATE = {
    story: {
        author: {},
        genres: [],
        chapters: []
    }
}

class ViewStory extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
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
            <Table.Cell key={index}><center>{genre.name}</center></Table.Cell>
        ));

        return (
            <Table.Row>{genreList}</Table.Row>
        )
    }

    onLinkClick = to =>
    {
        this.props.history.push(to);
    }

    listChapters(info)
    {
        const { props, story, onLinkClick } = info.info;
        const { chapters } = story;
        const { userInfo } = props;
        const { story_id } = props.match.params;
        const isCreator = (!!userInfo && userInfo.user.username === story.author.username);
        const chapterList = chapters.map((chapter, index) => (
            <Table.Row key={index}>
                <Table.Cell>{chapter.title}</Table.Cell>
                <Table.Cell>{chapter.description}</Table.Cell>
            </Table.Row>
        ));

        return (
            <Table.Body>
                <Table.Row><Table.Cell>
                    {isCreator ? 
                        <Button primary onClick={event => {onLinkClick(CREATE_CHAPTER.replace(":story_id", story_id))}}>Create Chapter</Button> :
                        null
                    }
                </Table.Cell></Table.Row>
                {chapterList}
            </Table.Body>
        );
    }

    render()
    {
        const { story } = this.state;

        return (
            <Container>
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
                        <this.listGenres genres={story.genres} />
                        <Table.Row>
                            <Table.Cell><center>{story.description}</center></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Table attached>
                    <this.listChapters info={{ props: this.props, story: story, onLinkClick: this.onLinkClick }} />
                </Table>
            </Container>
        );
    }
}

export default compose(withAuthStatic, withRouter)(ViewStory);