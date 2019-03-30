import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN, BACKEND, LIST_CHARACTERS, VIEW_CHARACTER } from "../../constants/routes";

const INITIAL_STATE = {
    characters: []
}

class ListCharacters extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
    {
        axios.post(`${BACKEND}${LIST_CHARACTERS}`, { token: localStorage.getItem("token") })
            .then(res =>
            {
                this.setState({ characters: res.data.characters });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    listCharacters(characters)
    {
        const characterList = characters.characters.map((character, index) => (
            <li key={index}><Link to={VIEW_CHARACTER.replace(":character_id", character._id)}>{character.name}</Link></li>
        ));

        return (<ul>{characterList}</ul>);
    }

    render()
    {
        return (
            <div>
                {!!this.state.characters ?
                    <div>
                        <this.listCharacters characters={this.state.characters} />
                    </div> :
                    <div></div>}
            </div>
        );
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(ListCharacters);