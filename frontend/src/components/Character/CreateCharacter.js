import React, { Component } from "react";
import axios from "axios";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN } from "../../constants/routes";

const INITIAL_STATE = {
    character: {
        name: ""
    }
}

class CreateCharacter extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event =>
    {
        const character = this.state.character;
        character[event.target.name] = event.target.value;
        this.setState({ character: character });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        console.log(this.state);


    }

    render()
    {
        const { character } = this.state;
        const isInvalid = (character.name === "");

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input type="text" name="name" value={character.name} onChange={this.onChange} placeholder="Name" />
                    <button disabled={isInvalid} type="submit">Create Character</button>
                </form>
            </div>
        );
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(CreateCharacter);