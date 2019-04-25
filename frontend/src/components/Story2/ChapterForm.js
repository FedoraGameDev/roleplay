import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";

class ChapterForm extends Component
{
    render()
    {
        return (
            <Form>
                <Button type="submit" primary>Create Chapter</Button>
            </Form>
        );
    }
}

export default ChapterForm;