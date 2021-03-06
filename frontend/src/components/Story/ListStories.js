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
    timeout = null;

    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

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
            })
    }

    filterStories = () =>
    {
        //TODO: this is slow (1N * genres)
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

    onGenreChange = genre =>
    {
        if (!!this.timeout)
            clearTimeout(this.timeout);
        const genreChecks = { ...this.state.genreChecks };
        genreChecks[genre] = !genreChecks[genre];
        this.setState({ genreChecks: genreChecks });
        this.timeout = setTimeout(this.filterStories, 500);
    }

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

    genreList(info)
    {
        const { genres, genreChecks, onGenreChange } = info.info;
        const listItems = genres.map((genre, index) =>
            <div className="genre-item" key={index}>
                <Checkbox
                    name={genre.name}
                    label={genre.name}
                    defaultChecked={genreChecks[genre.name]}
                    onChange={event => { onGenreChange(genre.name) }} />
            </div>
        );

        return <ul>{listItems}</ul>;
    }

    render()
    {
        const { genres, stories, genreChecks, filteredStories } = this.state;
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