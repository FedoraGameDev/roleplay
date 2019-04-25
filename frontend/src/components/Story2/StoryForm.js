import React, { Component } from "react"
import { Form, Button, Table, TextArea, Input, Placeholder, Checkbox, Card } from "semantic-ui-react"
import BookCover from "../../images/bookCover.jpg";
import GenreList from "./GenreList";

const INITIAL_STATE = {
    title: "",
    description: "",
    genresSelection: {},
    closed_group: false,
    color: "#000000"
}

class StoryForm extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onChange = event =>
    {
        this.setState({ [event.target.name]: event.target.value });
    }

    onGenreChange = genre =>
    {
        const genresSelection = { ...this.state.genresSelection };
        genresSelection[genre] = !genresSelection[genre];
        this.setState({ genresSelection: genresSelection });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        const { title, description, closed_group, genresSelection, color } = this.state;
        const { genres, onStorySubmit } = this.props;
        const selectedGenres = [];

        for (let i = 0; i < genres.length; i++)
        {
            const element = genresSelection[genres[i].name];

            if (element === true)
            {
                selectedGenres.splice(genres.length - 1, 0, genres[i]._id);
            }
        }

        const story = {
            title: title,
            description: description,
            closed_group: closed_group,
            genres: selectedGenres,
            color: color
        }

        onStorySubmit(story);
    }

    render()
    {
        const { title, description, color, closed_group } = this.state;
        const { genres } = this.props;

        return (
            <Form onSubmit={this.onSubmit}>
                <Table attached="top">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell collapsing>
                                <Input fluid type="color" onChange={this.onChange} name="color" value={color} />
                            </Table.Cell>
                            <Table.Cell>
                                <Input fluid type="text" onChange={this.onChange} name="title" value={title} placeholder="title" />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell width={2}>
                                <Card
                                    className={`book-card`}
                                    style={{
                                        width: "150px",
                                        height: "175px",
                                        backgroundImage: `url(${BookCover})`,
                                        backgroundSize: "150px auto"
                                    }}>
                                    <div className="Content" style={{ backgroundColor: `${color}55`, height: "100%" }} />
                                </Card>
                            </Table.Cell>
                            <Table.Cell>
                                <TextArea onChange={this.onChange} name="description" value={description} placeholder="description" />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Table attached="bottom">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell textAlign="center">
                                <GenreList genres={genres} onChange={this.onGenreChange} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right">
                                <Checkbox onChange={this.onChange} name="closed_group" toggle label="Require Character Approval" />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right">
                                <Button primary type="submit">Create</Button>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Form>
        )
    }
}

export default StoryForm;