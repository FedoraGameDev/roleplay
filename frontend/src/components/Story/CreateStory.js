import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Button, TextArea, Input, Container, Checkbox, Label, Form, Table, Header } from "semantic-ui-react";
import { compose } from "recompose";
import { BACKEND, CREATE_STORY, STORY_VIEW, SIGN_IN, LIST_GENRE } from "../../constants/routes";
import { withAuthorization } from "../firebase/Session";

const INITIAL_STATE = {
    title: "",
    description: "",
    closed_group: false,
    genres: [],
    genresSelection: {},
    error: null
}

class CreateStory extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        axios.get(`${BACKEND}${LIST_GENRE}`)
            .then(res =>
            {
                this.setState({
                    genres: res.data.genres
                });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    onChange = event =>
    {
        this.setState({ [event.target.name]: event.target.value });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        const { title, description, closed_group, genresSelection, genres } = this.state;
        const selectedGenres = [];

        for (let i = 0; i < genres.length; i++)
        {
            const element = genresSelection[genres[i].name];

            if (element === true)
            {
                selectedGenres.splice(genres.length - 1, 0, genres[i]._id);
            }
        }

        axios.post(`${BACKEND}/story/create`, {
            token: localStorage.getItem("token"),
            story:
            {
                title: title,
                description: description,
                closed_group: closed_group,
                genres: selectedGenres
            }
        }).then(res =>
        {
            this.props.history.push(STORY_VIEW.replace(":story_id", res.data.newStory._id));
        }).catch(error =>
        {
            this.setState({ error: error });
        });
    }

    genreList(info)
    {
        const { genres, onGenreChange } = info.info;
        const listItems = genres.map((genre, index) =>
            <div className="genre-item" key={index}>
                <Checkbox
                    name={genre.name}
                    label={genre.name}
                    onChange={event => { onGenreChange(genre.name) }} />
            </div>
        );

        return <ul>{listItems}</ul>;
    }

    onGenreChange = genre =>
    {
        const genresSelection = { ...this.state.genresSelection };
        genresSelection[genre] = !genresSelection[genre];
        this.setState({ genresSelection: genresSelection });
    }

    render()
    {
        const { title, description, closed_group, error, genres } = this.state;

        const isInvalid = (title === "" || description === "");

        return (
            <Container>
                <Table inverted attached="top">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center"><Header as="h2" inverted>New Story</Header></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                </Table>
                <Form onSubmit={this.onSubmit}>
                    <Table attached="bottom">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Input fluid type="text" onChange={this.onChange} name="title" value={title} placeholder="title" />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <TextArea onChange={this.onChange} name="description" value={description} placeholder="description" />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="center">
                                    <Label>Genres</Label>
                                    <this.genreList info={{ genres: genres, onGenreChange: this.onGenreChange }} />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Checkbox onChange={this.onChange} name="closed_group" toggle label="Require Character Approval" />
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Button disabled={isInvalid} primary type="submit">Create</Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>

                    {error && <p>{error.message}</p>}
                </Form>
            </Container>
        );
    }
}

class CreateStoryLinkBase extends Component
{
    Click = to =>
    {
        this.props.history.push(to);
    }

    render()
    {
        return (
            <Button primary onClick={event => this.Click(CREATE_STORY)}>New Story</Button>
        );
    }
}

const CreateStoryLink = withRouter(CreateStoryLinkBase);

export default compose(withRouter, withAuthorization(userInfo => !!userInfo, history => history.push(`${SIGN_IN}?forward=story/create`)))(CreateStory);
export { CreateStoryLink };