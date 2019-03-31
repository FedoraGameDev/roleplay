import React, { Component } from "react";

class CharacterCard extends Component
{
    render()
    {
        return (
            <div>{this.props.character.name}</div>
        )
    }
}

class CharacterGrid extends Component
{
    render()
    {
        const characterList = this.props.characters.map((character, index) => (
            <CharacterCard key={index} character={character} />
        ));

        return (<div>{characterList}</div>);
    }
}

export default CharacterCard;
export { CharacterGrid };