import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Card, Grid, Label, Image } from "semantic-ui-react";
import { VIEW_CHARACTER } from "../../constants/routes";

class CharacterCard extends Component
{
    render()
    {
        return (
            <Card><Link to={VIEW_CHARACTER.replace(":character_id", this.props.character._id)}>
                <Image src={this.props.character.appearance.image} />
                <center><Label>{this.props.character.name}</Label></center>
            </Link></Card>
        )
    }
}

class CharacterGrid extends Component
{
    render()
    {
        const characterList = this.props.characters.map((character, index) => (
            <Grid.Column key={index}><CharacterCard character={character} /></Grid.Column>
        ));

        return (<Grid centered stackable columns={9}><Grid.Row>{characterList}</Grid.Row></Grid>);
    }
}

export default CharacterCard;
export { CharacterGrid };