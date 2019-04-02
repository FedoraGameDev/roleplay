import React, { Component } from "react";
import Axios from "axios";
import { BACKEND, VIEW_CHARACTER } from "../../constants/routes";

const INITIAL_STATE = {
    character: {}
}

class ViewCharacter extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentWillMount()
    {
        Axios.post(`${BACKEND}${VIEW_CHARACTER.replace(":character_id", this.props.match.params.character_id)}`,
            { token: localStorage.token })
            .then(res =>
            {
                this.setState({ character: res.data.character });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    render()
    {
        const { character } = this.state;

        return (
            <div>
                {!!character ?
                    <div>
                        <label>{character.name}</label>
                    </div> :
                    <div></div>}
            </div>
        )
    }
}

export default ViewCharacter;