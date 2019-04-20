import React, { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import { Container, Loader } from "semantic-ui-react";
import { BACKEND, LIST_GENRE, LIST_STORY, STORY_VIEW, CHAPTER_VIEW } from "../../constants/routes";
import StoryList from "./StoryList";
import StoryView from "./StoryView";
import ChapterView from "./ChapterView";

const INITIAL_STATE = {
    genres: null,
    stories: null,
    genreChecks: {},
    filteredStories: []
}

/* StoryContainer
 * Container for all story pages
*/
class StoryContainer extends Component
{
    constructor(props)
    {
        super(props)

        this.state = { ...INITIAL_STATE };
    }

    /* componentDidMount
     * Sends requests to backend and receives story list and genre list.
    */
    componentDidMount()
    {
        axios.get(`${BACKEND}${LIST_GENRE}`)
            .then(res =>
            {
                const genreChecks = {};
                res.data.genres.forEach(element =>
                {
                    genreChecks[element.name] = false;
                });
                this.setState({
                    genres: res.data.genres
                });
            })
            .catch(error =>
            {
                console.log(error);
            });

        axios.get(`${BACKEND}${LIST_STORY}`)
            .then(res =>
            {
                this.setState({ stories: res.data.stories, filteredStories: [...res.data.stories] });
                this.filterStories();
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    /* filterStories
     * Sets state.filteredStories to all stories that have all genreChecks assigned to them.
    */
    filterStories = () =>
    {
        const { stories, genres, genreChecks } = this.state;
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
            const check = this.state.genreChecks[this.state.genres[i].name];
            if (check === undefined) continue;
            if (check === true)
                return true;
        }

        return false;
    }

    /* render
     * Displays Story List, Story, and Chapter depending on path
    */
    render()
    {
        const { stories, genres, filteredStories } = this.state;

        return (
            <div>
                {
                    (stories && genres) ?
                        [
                            <Route key={0} path={LIST_STORY} component={() => { return (<StoryList stories={filteredStories} />); }} />,
                            <Route key={1} path={STORY_VIEW} component={() => { return (<StoryView />); }} />,
                            <Route key={2} path={CHAPTER_VIEW} component={() => { return (<ChapterView />); }} />
                        ]
                        :
                        <Loader active />
                }
            </div>
        );
    }
}

export default StoryContainer;