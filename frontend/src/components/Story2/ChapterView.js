import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import axios from "axios";
import withAuthStatic from "../firebase/Session/withAuthStatic";
import { Table, Placeholder, Button, Header, Image, Modal } from "semantic-ui-react";
import { BACKEND, CHAPTER_VIEW, STORY_VIEW, CREATE_REPLY, UPDATE_REPLY } from "../../constants/routes";
import { makeCancelable } from "../../constants/extensions";
import ReplyForm from "./ReplyForm";

const INITIAL_STATE = {
    chapter: null,
    story: null
}

class ChapterView extends Component
{
    promises = [];

    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        const { story_id, chapter_name } = this.props.match.params;
        this.promises.splice(this.promises.length, 0, makeCancelable(axios.get(`${BACKEND}${CHAPTER_VIEW.replace(":story_id", story_id).replace(":chapter_name", chapter_name)}`)
            .then(res =>
            {
                this.setState({ chapter: res.data.chapter });
            })
            .catch(error =>
            {
                console.log(error);
            })));

        this.promises.splice(this.promises.length, 0, makeCancelable(axios.get(`${BACKEND}${STORY_VIEW.replace(":story_id", story_id)}`)
            .then(res =>
            {
                this.setState({ story: res.data.story });
            })
            .catch(error =>
            {
                console.log(error);
            })));
    }

    componentWillUnmount()
    {
        this.promises.forEach(promise => promise.cancel());
    }

    onSubmitPost = post =>
    {
        if (post.author && post.description)
        {
            axios.post(`${BACKEND}${CREATE_REPLY}`, { token: localStorage.getItem("token"), post: post, story: this.state.story, chapter: this.state.chapter })
                .then(res =>
                {
                    const place = this.props.history.location.pathname;
                    this.props.history.push("/");
                    this.props.history.push(place);
                })
                .catch(error =>
                {
                    console.log(error);
                });
        }
    }

    onUpdatePost = post =>
    {
        if (post.author && post.description)
        {
            axios.post(`${BACKEND}${UPDATE_REPLY}`, { token: localStorage.getItem("token"), post: post, story: this.state.story, chapter: this.state.chapter })
                .then(res =>
                {
                    const place = this.props.history.location.pathname;
                    this.props.history.push("/");
                    this.props.history.push(place);
                })
                .catch(error =>
                {
                    console.log(error);
                });
        }
    }

    render()
    {
        const { state, props } = this;
        const { chapter, story } = state;
        const { userInfo } = props;

        return (
            <div>
                {!!chapter && !!story ?
                    <Table className="basic-table">
                        <Table.Body>
                            <Table.Row><Table.Cell>
                                {!!userInfo ?
                                    <Modal trigger={<Button primary>New Reply</Button>} closeOnDimmerClick={false} closeIcon>
                                        <Modal.Header>New Reply</Modal.Header>
                                        <Modal.Content scrolling>
                                            <ReplyForm story={story} onSubmit={post => { this.onSubmitPost(post) }} actionText="Submit" />
                                        </Modal.Content>
                                    </Modal>
                                    :
                                    null
                                }
                            </Table.Cell></Table.Row>
                            {
                                chapter.posts.map((post, index) =>
                                {
                                    const TableBody = (post) => (
                                        <Table.Body>
                                            {
                                                userInfo && userInfo.username === post.author.user.username ?
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            <Modal trigger={<Button>Edit</Button>} closeOnDimmerClick={false} closeIcon>
                                                                <Modal.Header>Edit Reply</Modal.Header>
                                                                <Modal.Content scrolling>
                                                                    <ReplyForm story={story} reply={post} onSubmit={this.onUpdatePost} actionText="Update" />
                                                                </Modal.Content>
                                                            </Modal>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                    :
                                                    null
                                            }
                                            <Table.Row>
                                                <Table.Cell>
                                                    <div className="characterPlacard" style={{ width: "150px", float: "left", marginRight: "15px" }}>
                                                        <center><Header>{post.author.name}</Header></center>
                                                        <Image floated='left' src={post.author.appearance.image} style={{ width: "150px" }} />
                                                    </div>
                                                    <pre style={{ margin: "0" }}>{post.description}</pre>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    );

                                    return (
                                        <Table.Row key={index}><Table.Cell>
                                            {(index === chapter.posts.length - 1) ?
                                                <Table attached="bottom">{TableBody(post)}</Table> :
                                                <Table attached>{TableBody(post)}</Table>
                                            }
                                        </Table.Cell></Table.Row>
                                    )
                                })
                            }

                        </Table.Body>
                    </Table>
                    :
                    <Placeholder fluid>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Paragraph>
                    </Placeholder>
                }
            </div>
        );
    }
}

export default compose(withRouter, withAuthStatic)(ChapterView);