import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Form, Input, Button, Segment } from "semantic-ui-react";

const INITIAL_STATE = {
    passwordOne: "",
    passwordTwo: "",
    error: null
};

class PasswordChangeForm extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event =>
    {
        const { passwordOne } = this.state;

        this.props.firebase.doPasswordUpdate(passwordOne)
            .then(() =>
            {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error =>
            {
                this.setState({ error });
            });

        event.preventDefault();
    }

    onChange = event =>
    {
        this.setState({ [event.target.name]: event.target.value });
    }

    render()
    {
        const { passwordOne, passwordTwo, error } = this.state;

        const isInvalid = (passwordOne !== passwordTwo || passwordOne === "");

        return (
            <Segment>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="New Password" />
                        <Form.Input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Verify Password" />
                    </Form.Group>
                    <Button primary disabled={isInvalid} type="submit">Update My Password</Button>

                    {error && <p>{error.message}</p>}
                </Form>
            </Segment>
        );
    }
}

export default withFirebase(PasswordChangeForm);