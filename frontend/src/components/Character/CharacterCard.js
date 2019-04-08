import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Label, Image, Container } from "semantic-ui-react";
import { VIEW_CHARACTER } from "../../constants/routes";

/*<Card
    image='/images/avatar/large/elliot.jpg'
    header='Elliot Baker'
    meta='Friend'
    description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
    extra={extra}
/>*/

class CharacterCard extends Component
{
    render()
    {
        return (
            <Link to={VIEW_CHARACTER.replace(":character_id", this.props.character._id)}>
                <Card
                    image={this.props.character.appearance.image}
                    header={this.props.character.name} />
            </Link>
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

        return (<Container className="character-grid">{characterList}</Container>);
    }
}

export default CharacterCard;
export { CharacterGrid };