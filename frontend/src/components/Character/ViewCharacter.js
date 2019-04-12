import React, { Component } from "react";
import Axios from "axios";
import { Header, Label, Loader, Image, Container, Table } from "semantic-ui-react";
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
    },
    hairColor: {},
    eyeColor: {},
    ready: false
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

                Axios.get(`https://www.thecolorapi.com/id?format=json&hex=${this.state.character.appearance.eyes.replace("#", "")}`)
                    .then(res =>
                    {
                        console.log(res.data);
                        this.setState({ eyeColor: res.data });

                        Axios.get(`https://www.thecolorapi.com/id?format=json&hex=${this.state.character.appearance.hair.replace("#", "")}`)
                            .then(res =>
                            {
                                console.log(res.data);
                                this.setState({ hairColor: res.data, ready: true });
                            })
                            .catch(error =>
                            {
                                console.log(error);
                            });
                    })
                    .catch(error =>
                    {
                        console.log(error);
                    });
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    render()
    {
        const { character, ready, eyeColor, hairColor } = this.state;
        const { basicinfo, appearance } = character;

        return (
            <Container>
                {ready ?
                    [
                        <Table key={1} inverted attached="top"><Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Header as="h1" inverted size="huge">{character.name}</Header></center>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body></Table>,
                        <Table key={2} attached="bottom"><Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Table fixed basic="very">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell textAlign="center">Age</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">Gender</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">Birthday</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">Eyes</Table.HeaderCell>
                                                <Table.HeaderCell textAlign="center">Hair</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body><Table.Row>
                                            <Table.Cell textAlign="center">{basicinfo.age}</Table.Cell>
                                            <Table.Cell textAlign="center">{basicinfo.gender}</Table.Cell>
                                            <Table.Cell textAlign="center">{Months[basicinfo.birthmonth].text} {basicinfo.birthday}</Table.Cell>
                                            <Table.Cell textAlign="center">
                                                <div className="color-background" style={{ backgroundColor: eyeColor.name.closest_named_hex, color: eyeColor.contrast.value }}>
                                                    {eyeColor.name.value}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell textAlign="center">
                                                <div className="color-background" style={{ backgroundColor: hairColor.name.closest_named_hex, color: hairColor.contrast.value }}>
                                                    {hairColor.name.value}
                                                </div>
                                            </Table.Cell>
                                        </Table.Row></Table.Body>
                                    </Table>
                                    <center><Label><Header as="h2">Description</Header></Label></center>
                                    <Image src={character.appearance.image} floated="left" />
                                    <pre>{character.appearance.description}</pre>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Label><Header as="h2">Traits</Header></Label></center>
                                    <pre>{character.personality.traits}</pre>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Label><Header as="h2">Likes</Header></Label></center>
                                    <pre>{character.personality.likes}</pre>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Label><Header as="h2">Dislikes</Header></Label></center>
                                    <pre>{character.personality.dislikes}</pre>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Label><Header as="h2">Habits</Header></Label></center>
                                    <pre>{character.personality.habits}</pre>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Label><Header as="h2">Quirks</Header></Label></center>
                                    <pre>{character.personality.quirks}</pre>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <center><Label><Header as="h2">Backstory</Header></Label></center>
                                    <pre>{character.basicinfo.backstory}</pre>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body></Table>] :
                    <Loader active />}
            </Container>
        )
    }
}

{/* <Grid centered columns={1}>
    
    
</Grid> */}

export default ViewCharacter;