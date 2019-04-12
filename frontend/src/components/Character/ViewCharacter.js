import React, { Component } from "react";
import Axios from "axios";
import { Grid, Label, Loader, Image } from "semantic-ui-react";
import { BACKEND, VIEW_CHARACTER } from "../../constants/routes";
import Months from "../../constants/months";

const INITIAL_STATE = {
    character: {
        name: "",
        basicinfo: {
            age: "",
            gender: "",
            birthmonth: 0,
            birthday: 1,
            relationships: "",
            backstory: ""
        },
        appearance: {
            hair: "#000000",
            eyes: "#000000",
            description: "",
            image: ""
        },
        personality: {
            traits: "",
            likes: "",
            dislikes: "",
            habits: "",
            quirks: ""
        }
    }
}

class ViewCharacter extends Component
{
    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
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

        console.log(character);
        console.log(!character.appearance);

        return (
            <div>
                {!!character.name ?
                    <Grid centered columns={8}>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <center><Label size="huge">{character.name}</Label></center>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <center><Image src={character.appearance.image} /></center>
                            </Grid.Column>
                            <Grid.Column>
                                <center>
                                    <Label>{character.basicinfo.age} - {character.basicinfo.gender}{` - `}
                                        {Months[character.basicinfo.birthmonth].text} {character.basicinfo.birthday}</Label><br />
                                    <span style={{ backgroundColor: character.appearance.hair }}>Hair</span> - <span style={{ backgroundColor: character.appearance.eyes }}>Eyes</span>
                                    <br />{character.appearance.description}
                                </center>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <center><Label>Traits</Label></center>
                                <pre>{character.personality.traits}</pre>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <center><Label>Likes</Label></center>
                                <pre>{character.personality.likes}</pre>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <center><Label>Dislikes</Label></center>
                                <pre>{character.personality.dislikes}</pre>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <center><Label>Habits</Label></center>
                                <pre>{character.personality.habits}</pre>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <center><Label>Quirks</Label></center>
                                <pre>{character.personality.quirks}</pre>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <center><Label>Backstory</Label></center>
                                <pre>{character.basicinfo.backstory}</pre>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid> :
                    <Loader active />}
            </div>
        )
    }
}

export default ViewCharacter;