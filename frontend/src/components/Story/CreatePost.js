import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Button, Form, TextArea } from "semantic-ui-react";
import { CREATE_POST } from "../../constants/routes";

const INITIAL_STATE = {
    postData: "",
    character: 0
}

class CreatePost extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) =>
    {
        //
    }

    onChange = (event) =>
    {
        this.setState({ postData: event.target.value });
    }

    render()
    {
        return (
            <Form onSubmit={this.onSubmit}>
                <select placeholder="Characters" value={this.state.character}>
                    {
                        this.props.characters.map((character, index) =>
                            (
                                <option key={index} value={character._id}>{character.name}</option>
                            ))
                    }
                </select>
                <TextArea placeholder="paragraph" name="postData" onChange={this.onChange} />
                <Button primary type="submit">Submit</Button>
            </Form>
        )
    }
}

class CreatePostButtonBase extends Component
{
    clickLink = (to) =>
    {
        this.props.history.push(to);
    }

    render()
    {
        const { story_id } = this.props.info;

        return (
            <Button primary onClick={event => { this.clickLink(CREATE_POST.replace(":story_id", story_id)) }}>Write Paragraph</Button>
        )
    }
}

const CreatePostButton = withRouter(CreatePostButtonBase);

export default CreatePost;
export { CreatePostButton };