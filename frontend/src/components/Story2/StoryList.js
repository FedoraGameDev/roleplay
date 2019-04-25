import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withAuthStatic } from "../firebase/Session";
import { compose } from "recompose";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Book from "./Book";
import { Container, Button, Modal, Segment, Card, Checkbox } from "semantic-ui-react";
import StoryForm from "./StoryForm";
import { BACKEND, STORY_VIEW, LIST_STORY, LIST_STORY_PART } from "../../constants/routes";
import { makeCancelable } from "../../constants/extensions";
import GenreList from "./GenreList";
import BookCover from "../../images/bookCover.jpg";

const INITIAL_STATE = {
    stories: null,
    loadedQty: 0,
    genreChecks: {},
    filteredStories: [],
    hasMore: true
}

class StoryList extends Component
{
    fetchStoriesPromise = null;
    keepLoadingDataRoutine = null;

    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onStoryCreateSubmit = story =>
    {
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
        this.PullDataPart(0, 30);
    }

    componentWillUnmount()
    {
        if (this.fetchStoriesPromise)
            this.fetchStoriesPromise.cancel();
    }

    onGenreChange = genre =>
    {
        if (!!this.timeout)
            clearTimeout(this.timeout);
        const genreChecks = { ...this.state.genreChecks };
        genreChecks[genre] = !genreChecks[genre];
        this.setState({ genreChecks: genreChecks });
        this.timeout = setTimeout(this.filterStories, 500);
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
        for (let i = 0; i < this.props.genres.length; i++)
        {
            const check = this.state.genreChecks[this.props.genres[i].name];
            if (check === undefined) continue;
            if (check === true)
                return true;
        }

        return false;
    }

    fetchData = () =>
    {
        if (this.fetchStoriesPromise)
            return;
        //this.fetchStoriesPromise.cancel();
        console.log(`Fetching ${this.state.loadedQty} - ${this.state.loadedQty + 10}...`);
        this.PullDataPart(this.state.loadedQty, 10);
    }

    PullDataPart = (start, quantity) =>
    {
        this.fetchStoriesPromise = makeCancelable(axios.get(`${BACKEND + LIST_STORY}/${start}/${quantity}`)
            .then(res =>
            {
                let storyData = res.data.stories;
                if (this.state.stories)
                    storyData = [...this.state.stories, ...res.data.stories];
                this.setState({
                    stories: [...storyData],
                    filteredStories: [...res.data.stories],
                    loadedQty: storyData.length,
                    hasMore: res.data.hasMore
                });
                this.fetchStoriesPromise = null;
                //TODO: filter the stories
                this.filterStories();
            })
            .catch(error =>
            {
                console.log(error);
            }));
    }

    /* render
     * Display a list of stories based on property 'stories'
    */
    render()
    {
        const { genres } = this.props;
        const { stories, hasMore, filteredStories } = this.state;

        return (
            <Container>
                <Modal trigger={<center><Button primary>New Story</Button></center>} dimmer="blurring" closeOnDimmerClick={false} closeIcon>
                    <Modal.Header>New Story</Modal.Header>
                    <Modal.Content>
                        <StoryForm genres={genres} onStorySubmit={this.onStoryCreateSubmit} actionText="Create" />
                    </Modal.Content>
                </Modal>
                {
                    !!genres ?
                        <Segment>
                            <GenreList genres={genres} onChange={this.onGenreChange} />
                        </Segment>
                        :
                        null

                }
                {
                    !!stories ?
                        <InfiniteScroll
                            className="ui centered cards"
                            style={{ marginTop: "20px" }}
                            dataLength={stories.length}
                            next={this.fetchData}
                            hasMore={hasMore}
                            hasChildren={true}>
                            {
                                filteredStories.map((story, index) =>
                                    (
                                        <Book key={index} story={story} />
                                    ))
                            }
                            {
                                hasMore ?
                                    <Book loader />
                                    :
                                    null
                            }
                        </InfiniteScroll>
                        :
                        <Card.Group centered>
                            <Book loader />
                        </Card.Group>
                }
            </Container>
        );
    }
}

export default compose(withRouter, withAuthStatic)(StoryList);