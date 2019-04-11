import React, { Component } from "react";
import { Container, Loader, Table } from "semantic-ui-react";
import axios from "axios";
import { BACKEND, CHAPTER_VIEW } from "../../constants/routes";

const INITIAL_STATE = {
    chapter: null
}

class ViewChapter extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
    {
        const { story_id, chapter_name } = this.props.match.params;
        axios.get(`${BACKEND}${CHAPTER_VIEW.replace(":story_id", story_id).replace(":chapter_name", chapter_name)}`)
            .then(res =>
            {
                console.log(res.data.chapter);
                this.setState({ chapter: res.data.chapter });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    listReplies(info)
    {
        const { chapter } = info.info;
        console.log(chapter);

        const replies = chapter.posts.map((post, index) =>
            (
                <Table.Row key={index}><Table.Cell>
                    <Table>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    {post.description}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Table.Cell></Table.Row>
            ));

        return (<Table.Body>{replies}</Table.Body>);
    }

    render()
    {
        const { chapter } = this.state;

        return (
            <Container>
                {!!chapter ? <Table><this.listReplies info={{ chapter: chapter }} /></Table> : <Loader active />}
            </Container>
        );
    }
}

export default ViewChapter;