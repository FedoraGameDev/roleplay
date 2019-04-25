import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, Container } from "semantic-ui-react";
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
    onClick = () =>
    {
        if (this.props.onClick)
            this.props.onClick(this.props.character._id);
        else
            this.goToPage(VIEW_CHARACTER.replace(":character_id", this.props.character._id))
    }

    goToPage = to =>
    {
        this.props.history.history.push(to);
    }

    render()
    {
        return (
            <Card
                className="character-card"
                image={this.props.character.appearance.image}
                header={this.props.character.name}
                link
                onClick={event => { this.onClick(); }} />
        )
    }
}

class CharacterGridBase extends Component
{
    render()
    {
        const characterList = this.props.characters.map((character, index) => (
            <CharacterCard key={index} character={character} history={{ history: this.props.history }} onClick={this.props.onClick} />
        ));

        return (<Container className="character-grid"><Card.Group centered>{characterList}</Card.Group></Container>);
    }
}

const CharacterGrid = withRouter(CharacterGridBase);

export default withRouter(CharacterCard);
export { CharacterGrid };