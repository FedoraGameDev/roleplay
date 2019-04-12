import React, { Component } from "react";
import { Container, Loader, Table, Image, Header, Button } from "semantic-ui-react";
import axios from "axios";
import { BACKEND, CHAPTER_VIEW } from "../../constants/routes";
import CreatePost from "./CreatePost";

const INITIAL_STATE = {
    chapter: null,
    showReplyForm: false
}

class ViewChapter extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        const { story_id, chapter_name } = this.props.match.params;
        axios.get(`${BACKEND}${CHAPTER_VIEW.replace(":story_id", story_id).replace(":chapter_name", chapter_name)}`)
            .then(res =>
            {
                this.setState({ chapter: res.data.chapter });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    createParagraphClick = event =>
    {
        this.setState({ showReplyForm: !this.state.showReplyForm });
    }

    listReplies(info)
    {
        const { myself } = info.info;
        const { state } = myself;
        const { chapter, showReplyForm } = state;
        const TableBody = (post) => (
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Image floated='left' src={post.author.appearance.image} />
                        <pre>{post.description}</pre>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        );

        const replies = chapter.posts.map((post, index) =>
            (
                <Table.Row key={index}><Table.Cell>
                    <Table attached="top" inverted>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Header as="h2" inverted>{post.author.name}</Header></center>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    {(index === chapter.posts.length - 1) ?
                        <Table attached="bottom">{TableBody(post)}</Table> :
                        <Table attached>{TableBody(post)}</Table>
                    }
                </Table.Cell></Table.Row>
            ));

        return (
            <Table.Body>
                {replies}
                <Table.Row><Table.Cell>
                    <Button primary={!showReplyForm} secondary={showReplyForm} onClick={myself.createParagraphClick}>{showReplyForm ? "Cancel" : "Create Paragraph"}</Button>
                    {
                        showReplyForm ?
                            <CreatePost /> :
                            null
                    }
                </Table.Cell></Table.Row>
            </Table.Body>
        );
    }

    render()
    {
        return (
            <Container>
                {!!this.state.chapter ? <Table className="basic-table"><this.listReplies info={{ myself: this }} /></Table> : <Loader active />}
            </Container>
        );
    }
}

export default ViewChapter;