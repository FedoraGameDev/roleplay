import React, { Component } from "react"
import { Route } from "react-router-dom";
import axios from "axios";
import { Loader } from "semantic-ui-react";
import { BACKEND, LIST_GENRE, LIST_STORY, LIST_STORY_PART, STORY_VIEW, CHAPTER_VIEW } from "../../constants/routes";
import StoryList from "./StoryList";
import StoryView from "./StoryView";
import ChapterView from "./ChapterView";
import { makeCancelable } from "../../constants/extensions";

const INITIAL_STATE = {
    genres: null
}

/* StoryContainer
 * Container for all story pages
*/
class StoryContainer extends Component
{
    promises = [];

    constructor(props)
    {
        super(props)

        this.state = { ...INITIAL_STATE };
    }

    /* componentDidMount
     * Sends requests to backend and receives genre list.
    */
    componentDidMount()
    {
        this.promises.splice(this.promises.length - 1, 0, makeCancelable(axios.get(`${BACKEND}${LIST_GENRE}`)
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
            })));
    }

    /* render
     * Displays Story List, Story, and Chapter depending on path
    */
    render()
    {
        const { genres } = this.state;

        return (
            <div>
                {
                    (genres) ?
                        [
                            <Route key={0} path={LIST_STORY} component={() => { return (<StoryList genres={genres} />); }} />,
                            <Route key={1} path={STORY_VIEW} component={() => { return (<StoryView genres={genres} />); }} />,
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