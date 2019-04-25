import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, Container, Image } from "semantic-ui-react";
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
    onClick = character =>
    {
        if (this.props.onClick)
            this.props.onClick(character);
        else
            this.goToPage(VIEW_CHARACTER.replace(":character_id", character._id))
    }

    goToPage = to =>
    {
        this.props.history.push(to);
    }

    render()
    {
        const { actionButtons, character } = this.props;

        return (
            <Card link className="character-card" onClick={() => this.onClick(character)}>
                <Image src={character.appearance.image} />
                <Card.Content>
                    <Card.Header>{character.name}</Card.Header>
                    {actionButtons}
                </Card.Content>
            </Card>
        )
    }
}

class CharacterGridBase extends Component
{
    render()
    {
        const { actionButtons } = this.props;
        const characterList = this.props.characters.map((character, index) => (
            <CharacterCard key={index} character={character} history={this.props.history} onClick={this.props.onClick} actionButtons={actionButtons} />
        ));

        return (<Container className="character-grid"><Card.Group centered>{characterList}</Card.Group></Container>);
    }
}

const CharacterGrid = withRouter(CharacterGridBase);

export default withRouter(CharacterCard);
export { CharacterGrid };