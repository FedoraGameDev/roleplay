import React, { Component } from "react"
import { Form, Button, Table, TextArea, Input, Placeholder, Checkbox, Card } from "semantic-ui-react"
import BookCover from "../../images/bookCover.jpg";
import GenreList from "./GenreList";

const INITIAL_STATE = {
    story: {
        author: {},
        chapters: [],
        characters: [],
        description: "",
        genres: [],
        subscribers: [],
        applicantcharacters: [],
        color: "#000000",
        title: ""
    },
    genresSelection: {},
    // title: "",
    // description: "",
    // closed_group: false,
    // color: "#000000"
}

class StoryForm extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        if (this.props.story)
        {
            let genresSelection = {};
            const usedGenres = this.props.story.genres.map(genre => genre.name);
            this.props.genres.forEach(genre =>
            {
                if (usedGenres.indexOf(genre.name) !== -1)
                    genresSelection[genre.name] = true;
                else
                    genresSelection[genre.name] = false;
            });
            this.setState({ story: this.props.story, genresSelection: genresSelection });
        }
        else
        {
            let genresSelection = {};
            this.props.genres.forEach(genre =>
            {
                genresSelection[genre.name] = false;
            });
            this.setState({ genresSelection: genresSelection });
        }
    }

    onChange = event =>
    {
        let story = { ...this.state.story };
        story[event.target.name] = event.target.value;
        this.setState({ story: story });
    }

    onCheckboxChange = (event, { checked }) =>
    {
        let story = { ...this.state.story };
        story.closed_group = checked;
        this.setState({ story: story });
    }

    onGenreChange = genre =>
    {
        let genresSelection = { ...this.state.genresSelection };
        genresSelection[genre] = !genresSelection[genre];
        this.setState({ genresSelection: genresSelection });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        const story = { ...this.state.story };
        const genresSelection = { ...this.state.genresSelection };
        const { genres, onStorySubmit } = this.props;
        let selectedGenres = [];

        for (let i = 0; i < genres.length; i++)
        {
            if (genresSelection[genres[i].name])
                selectedGenres.splice(selectedGenres.length, 0, genres[i]._id);
        }

        story.genres = selectedGenres;

        onStorySubmit(story);
    }

    render()
    {
        const { story, genresSelection } = this.state;
        const { title, description, color, closed_group } = story;
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
                                <GenreList genres={genres} selections={genresSelection} onChange={this.onGenreChange} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right">
                                <Checkbox onChange={this.onCheckboxChange} name="closed_group" checked={closed_group} toggle label="Require Character Approval" />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right">
                                <Button primary type="submit">{this.props.actionText}</Button>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Form>
        )
    }
}

export default StoryForm;