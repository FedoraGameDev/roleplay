import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card } from "semantic-ui-react";
import { VIEW_CHARACTER } from "../../constants/routes";

class CharacterCard extends Component
{
    render()
    {
        return (
            <Card><Link to={VIEW_CHARACTER.replace(":character_id", this.props.character._id)}>
                {this.props.character.name}
            </Link></Card>
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