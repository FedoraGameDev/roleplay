import React, { Component } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN, BACKEND, LIST_CHARACTERS } from "../../constants/routes";
import { CreateCharacterButton, CharacterGrid } from "./";
import { makeCancelable } from "../../constants/extensions";

const INITIAL_STATE = {
    characters: []
}

class ListCharacters extends Component
{
    promises = [];

    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        this.promises.splice(this.promises.length - 1, 0, makeCancelable(axios.post(`${BACKEND}${LIST_CHARACTERS}`, { token: localStorage.getItem("token") })
            .then(res =>
            {
                this.setState({ characters: res.data.characters });
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

    render()
    {
        return (
            <div>
                {!!this.state.characters ?
                    <Container>
                        <CreateCharacterButton />
                        <CharacterGrid characters={this.state.characters} />
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