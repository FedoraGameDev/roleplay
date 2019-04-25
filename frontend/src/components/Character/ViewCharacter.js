import React, { Component } from "react";
import axios from "axios";
import { Header, Label, Loader, Image, Container, Table, Modal, Button } from "semantic-ui-react";
import { BACKEND, VIEW_CHARACTER, UPDATE_CHARACTER } from "../../constants/routes";
import { withAuthStatic } from "../firebase/Session";
import Months from "../../constants/months";
import CharacterForm from "./CharacterForm";
import cloudinary from "cloudinary/lib/cloudinary";

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
    initialCharacter;

    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        axios.post(`${BACKEND}${VIEW_CHARACTER.replace(":character_id", this.props.match.params.character_id)}`,
            { token: localStorage.token })
            .then(res =>
            {
                this.setState({ character: res.data.character });
                this.initialCharacter = {
                    _id: this.state.character._id,
                    name: `${this.state.character.name}`,
                    basicinfo: { ...this.state.character.basicinfo },
                    appearance: { ...this.state.character.appearance },
                    personality: { ...this.state.character.personality }
                };

                axios.get(`https://www.thecolorapi.com/id?format=json&hex=${this.state.character.appearance.eyes.replace("#", "")}`)
                    .then(res =>
                    {
                        this.setState({ eyeColor: res.data });

                        axios.get(`https://www.thecolorapi.com/id?format=json&hex=${this.state.character.appearance.hair.replace("#", "")}`)
                            .then(res =>
                            {
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

    onSubmit = (state, imageRef) =>
    {
        const { character, pixelCrop, crop } = state;
        let modifiedCharacter = { _id: character._id };
        const basicLines = ["age", "gender", "birthmonth", "birthday", "relationships", "backstory"];
        const appearanceLines = ["hair", "eyes", "description", "image"];
        const personalityLines = ["traits", "likes", "dislikes", "habits", "quirks"];

        if (character.name !== this.initialCharacter.name)
            modifiedCharacter.name = character.name;

        basicLines.forEach(element =>
        {
            if (character.basicinfo[element] !== this.initialCharacter.basicinfo[element])
            {
                if (modifiedCharacter.basicinfo == null)
                    modifiedCharacter.basicinfo = {};
                modifiedCharacter.basicinfo[element] = character.basicinfo[element];
            }
        });

        appearanceLines.forEach(element =>
        {
            if (character.appearance[element] !== this.initialCharacter.appearance[element])
            {
                if (modifiedCharacter.appearance == null)
                    modifiedCharacter.appearance = {};
                modifiedCharacter.appearance[element] = character.appearance[element];
            }
        });

        personalityLines.forEach(element =>
        {
            if (character.personality[element] !== this.initialCharacter.personality[element])
            {
                if (modifiedCharacter.personality == null)
                    modifiedCharacter.personality = {};
                modifiedCharacter.personality[element] = character.personality[element];
            }
        });

        if (imageRef && crop.width && crop.height)
        {
            const canvas = document.createElement('canvas');
            canvas.width = 250;
            canvas.height = 250;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                imageRef,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                250,
                250
            );

            cloudinary.config({
                cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
                api_key: process.env.REACT_APP_CLOUDINARY_KEY,
                api_secret: process.env.REACT_APP_CLOUDINARY_SECRET
            });

            cloudinary.uploader.upload(canvas.toDataURL(), { tags: "user_image" })
                .then(image =>
                {
                    if (modifiedCharacter.appearance == null)
                        modifiedCharacter.appearance = {};
                    modifiedCharacter.appearance.image = image.url;
                    this.sendModifiedCharacter(modifiedCharacter);
                })
                .catch(error =>
                {
                    console.log(error);
                });
        }
        else
        {
            this.sendModifiedCharacter(modifiedCharacter);
        }
    }

    sendModifiedCharacter = modifiedCharacter =>
    {
        console.log(modifiedCharacter);
        axios.post(`${BACKEND}${UPDATE_CHARACTER}`, { token: localStorage.token, character: modifiedCharacter })
            .then(res =>
            {
                this.props.history.push(VIEW_CHARACTER.replace(":character_id", this.state.character._id));
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    render()
    {
        const { character, ready, eyeColor, hairColor } = this.state;
        const { basicinfo } = character;

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
                            {
                                this.props.userInfo ?
                                    <Table.Row>
                                        <Table.Cell>
                                            <Modal key={0} trigger={<center><Button primary>Modify Character</Button></center>} dimmer="blurring" closeOnDimmerClick={false} closeIcon>
                                                <Modal.Header>Modify {character.name}</Modal.Header>
                                                <Modal.Content scrolling>
                                                    <CharacterForm character={character} onSubmit={this.onSubmit} actionName="Update Character" />
                                                </Modal.Content>
                                            </Modal>
                                        </Table.Cell>
                                    </Table.Row>
                                    :
                                    null
                            }
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

export default withAuthStatic(ViewCharacter);