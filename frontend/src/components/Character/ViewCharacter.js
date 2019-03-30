import React, { Component } from "react";

const INITIAL_STATE = {
    character: {}
}

class ViewCharacter extends Component
{
    //

    render()
    {
        return (
            <div>View Character {this.props.match.params.character_id}</div>
        )
    }
}

export default ViewCharacter;