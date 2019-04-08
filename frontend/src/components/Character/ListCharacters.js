import React, { Component } from "react";
import axios from "axios";
import { Grid, Container } from "semantic-ui-react";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN, BACKEND, LIST_CHARACTERS } from "../../constants/routes";
import { CreateCharacterButton, CharacterGrid } from "./";

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

    render()
    {
        return (
            <div>
                {!!this.state.characters ?
                    <Container>
                        <CreateCharacterButton />
                        <center><CharacterGrid characters={this.state.characters} /></center>
                    </Container> :

                    <div>
                        <CreateCharacterButton />
                    </div>}
            </div>
        );
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(ListCharacters);