import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Button, Form, TextArea } from "semantic-ui-react";
import { CREATE_POST } from "../../constants/routes";

class CreatePost extends Component
{
    render()
    {
        return (
            <Container>
                <Form>
                    <TextArea placeholder="paragraph" />
                </Form>
            </Container>
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