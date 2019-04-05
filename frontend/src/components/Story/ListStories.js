import React, { Component } from "react";
import { Container, Checkbox, Loader } from "semantic-ui-react";
import axios from "axios";
import { CreateStoryLink } from "./CreateStory";
import { StoryTable } from "./StoryCard";
import { BACKEND, LIST_GENRE, LIST_STORY } from "../../constants/routes";

const INITIAL_STATE = {
    genres: [],
    genreChecks: [],
    stories: [],
    filteredStories: []
}

class Story extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
    {
        axios.get(`${BACKEND}${LIST_GENRE}`)
            .then(res =>
            {
                const genreChecks = {};
                res.data.genres.forEach(element =>
                {
                    genreChecks[element.name] = false;
                });
                this.setState({ genres: res.data.genres, genreChecks: genreChecks });
            })
            .catch(error =>
            {
                console.log(error);
            });

        axios.get(`${BACKEND}${LIST_STORY}`)
            .then(res =>
            {
                this.setState({ stories: res.data.stories });//, filteredStories: res.data.stories });
                this.filterStories();
            })
            .catch(error =>
            {
                console.log(error);
            })
    }

    onGenreChange = genre =>
    {
        const genreChecks = this.state.genreChecks;
        genreChecks[genre] = !genreChecks[genre];
        this.setState({ genreChecks: genreChecks });
        this.filterStories();
    }

    filterStories = () =>
    {
        if (this.checkFilters())
        {
            //
        }
        else
        {
            this.setState({ filteredStories: this.state.stories });
        }
    }

    checkFilters = () =>
    {
        this.state.genres.forEach(element =>
        {
            if (this.state.genreChecks[element.name])
                return true;
        });

        return false;
    }

    genreList(info)
    {
        const { genres, genreChecks, onGenreChange } = info.info;
        const listItems = genres.map((genre, index) =>
            <li key={index}>
                <Checkbox
                    name={genre.name}
                    label={genre.name}
                    defaultChecked={genreChecks[genre.name]}
                    onChange={event => { onGenreChange(genre.name) }} />
            </li>
        );

        return <ul>{listItems}</ul>;
    }

    render()
    {
        const { genres, stories, filteredStories, genreChecks } = this.state;
        return (
            <Container>
                {(!!genres && !!stories) ? [
                    <CreateStoryLink key={0} />,
                    <Container key={1}><this.genreList info={{ genres, genreChecks, onGenreChange: this.onGenreChange }} /></Container>,
                    <Container key={2}><StoryTable stories={filteredStories} /></Container>
                ] :
                    <Loader active />
                }
            </Container>
        );
    }
}

export default Story;