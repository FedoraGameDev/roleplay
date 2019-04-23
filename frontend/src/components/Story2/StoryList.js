import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Book from "./Book";
import { Card, Button, Modal, Loader } from "semantic-ui-react";
import StoryForm from "./StoryForm";
import { BACKEND, STORY_VIEW, LIST_STORY, LIST_STORY_PART } from "../../constants/routes";
import { makeCancelable } from "../../constants/extensions";

const INITIAL_STATE = {
    stories: null,
    genreChecks: {},
    filteredStories: []
}

class StoryList extends Component
{
    promises = [];

    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onStoryCreateSubmit = story =>
    {
        console.log(story);

        axios.post(`${BACKEND}/story/create`, {
            token: localStorage.getItem("token"),
            story: story
        }).then(res =>
        {
            this.props.history.push(STORY_VIEW.replace(":story_id", res.data.newStory._id));
        }).catch(error =>
        {
            this.setState({ error: error });
        });
    }

    /* componentDidMount
     * Sends requests to backend and receives story list.
    */
    componentDidMount()
    {
        //TODO: Retrieve stories in parts.
        this.promises.splice(this.promises.length - 1, 0, makeCancelable(axios.get(`${BACKEND + LIST_STORY}/0/10`)
            .then(res =>
            {
                this.setState({ stories: res.data.stories, filteredStories: [...res.data.stories] });
                //this.filterStories();
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

    /* filterStories
     * Sets state.filteredStories to all stories that have all genreChecks assigned to them.
    */
    filterStories = () =>
    {
        const { stories, genreChecks } = this.state;
        const { genres } = this.props;
        const newFilter = [...stories];

        if (this.checkFilters())
        {
            for (let i = 0; i < genres.length; i++)
            {
                const element = genreChecks[genres[i].name];

                if (element === true)
                {
                    var iter = 0;
                    while (iter < newFilter.length)
                    {
                        if (newFilter[iter].genres.indexOf(genres[i]._id) !== -1)
                            iter++;
                        else
                            newFilter.splice(iter, 1);
                    }
                }
            }
        }

        this.setState({ filteredStories: newFilter });
    }

    /* checkFilters
     * Returns true if any filters are active, else returns false.
    */
    checkFilters = () =>
    {
        for (let i = 0; i < this.state.genres.length; i++)
        {
            const check = this.state.genreChecks[this.props.genres[i].name];
            if (check === undefined) continue;
            if (check === true)
                return true;
        }

        return false;
    }

    /* render
     * Display a list of stories based on property 'stories'
    */
    render()
    {
        const { genres } = this.props;
        const { stories } = this.state;

        return (
            <div>
                <Modal trigger={< center > <Button primary>New Story</Button></center >} dimmer="blurring" >
                    <Modal.Header>New Story</Modal.Header>
                    <Modal.Content>
                        <StoryForm genres={genres} onStorySubmit={this.onStoryCreateSubmit} />
                    </Modal.Content>
                </Modal>
                {
                    stories ?
                        <Card.Group centered style={{ marginTop: "5px" }}>
                            {
                                stories.map((story, index) =>
                                    (
                                        <Book key={index} story={story} genres={genres} />
                                    ))
                            }
                        </Card.Group>
                        :
                        <div><br /><br /><br /><br /><Loader active /></div>
                }
            </div >
        );
    }
}

export default withRouter(StoryList);