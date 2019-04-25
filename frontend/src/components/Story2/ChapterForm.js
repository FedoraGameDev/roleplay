import React, { Component } from "react";
import { Form, Button, TextArea } from "semantic-ui-react";

const INITIAL_STATE = {
    chapter: {
        description: "",
        title: ""
    }
}

class ChapterForm extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        if (this.props.chapter)
            this.setState({ chapter: this.props.chapter });
    }

    onChange = event =>
    {
        let chapter = { ...this.state.chapter };
        chapter.description = event.target.value;
        this.setState({ chapter: chapter });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        this.props.onSubmit(this.state.chapter);
    }

    render()
    {
        const { chapter } = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                <TextArea placeholder="Description..." value={chapter.description} onChange={this.onChange} />
                <Button type="submit" primary>Create Chapter</Button>
            </Form>
        );
    }
}

export default ChapterForm;