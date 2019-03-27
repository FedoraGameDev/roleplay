import React, { Component } from "react";
import axios from "axios";

const INITIAL_STATE = {
    genres: []
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
        axios.get("http://localhost:3001/story")
            .then(res =>
            {
                this.setState({ genres: res.data.genres });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    genreList(state)
    {
        const listItems = state.state.genres.map((genre, index) =>
            <li key={index}>{genre.name}</li>
        );

        return <ul>{listItems}</ul>;
    }

    render()
    {
        return ([
            <h1 key="0">Hello!</h1>,
            <this.genreList key="1" state={this.state} />
        ]);
    }
}

export default Story;