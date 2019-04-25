import React, { Component } from "react";
import { Form, Button, TextArea, Table, Header, Image, Message, Segment } from "semantic-ui-react";
import axios from "axios";
import { makeCancelable } from "../../constants/extensions";
import { BACKEND, LIST_CHARACTERS } from "../../constants/routes";
import { CharacterGrid } from "../Character";

const INITIAL_STATE = {
    reply: {
        author: null,
        description: ""
    },
    characterList: [],
    loadedCharacters: false
}

class ReplyForm extends Component
{
    promises = [];

    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        if (this.props.reply)
            this.setState({ reply: this.props.reply });
        this.promises.splice(this.promises.length - 1, 0, makeCancelable(axios.post(`${BACKEND}${LIST_CHARACTERS}`, { token: localStorage.getItem("token") })
            .then(res =>
            {
                const chars = res.data.characters;
                const ids = this.props.story.characters.map((character, index) => character._id);

                const filteredChars = chars.filter(({ _id }) => ids.includes(_id));

                if (chars.length === 0)
                    this.setState({ characterList: null, loadedCharacters: true });
                else
                    this.setState({ characterList: filteredChars, loadedCharacters: true });
            })
            .catch(error =>
            {
                console.log(error);
            })));
    }

    onChange = event =>
    {
        let reply = { ...this.state.reply };
        reply.description = event.target.value;
        this.setState({ reply: reply });
    }

    onSubmit = event =>
    {
        console.log(this.state.reply);
        this.props.onSubmit(this.state.reply);
    }

    onCharacterApplyClick = character =>
    {
        let reply = { ...this.state.reply };
        reply.author = character;
        this.setState({ reply: reply });
    }

    render()
    {
        const { characterList, loadedCharacters, reply } = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                {
                    loadedCharacters && characterList ? [
                        <CharacterGrid key={0} characters={characterList} onClick={this.onCharacterApplyClick} />,
                        <TextArea key={1} placeholder="Description..." value={this.state.reply.description} onChange={this.onChange} />,
                        <Button key={2} type="submit" primary>{this.props.actionText}</Button>,
                        <Table key={3}>
                            <Table.Body>
                                <Table.Row>
                                    {
                                        !!reply.author ?
                                            <Table.Cell>
                                                <div className="characterPlacard" style={{ width: "150px", float: "left", marginRight: "15px" }}>
                                                    <center><Header>{reply.author.name}</Header></center>
                                                    <Image floated='left' src={reply.author.appearance.image} style={{ width: "150px" }} />
                                                </div>
                                                <pre style={{ margin: "0" }}>{reply.description}</pre>
                                            </Table.Cell>
                                            :
                                            <Table.Cell>
                                                <div className="characterPlacard" style={{ width: "150px", float: "left", marginRight: "15px" }}>
                                                    <center><Header>Choose a Character</Header></center>
                                                    <Image floated='left' src={null} style={{ width: "150px" }} />
                                                </div>
                                                <pre style={{ margin: "0" }}>{reply.description}</pre>
                                            </Table.Cell>
                                    }
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    ]
                        :
                        <Segment>
                            <Message>
                                <Message.Header>
                                    No characters to reply with!
                            </Message.Header>
                            </Message>
                        </Segment>
                }
            </Form>
        );
    }
}

export default ReplyForm;