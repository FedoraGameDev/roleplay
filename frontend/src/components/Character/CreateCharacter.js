import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Input, Form, Button, Grid, TextArea, Label, Dropdown, Container } from "semantic-ui-react";
import cloudinary from "cloudinary/lib/cloudinary";
import ReactCrop from "react-image-crop";
import 'react-image-crop/lib/ReactCrop.scss';
import axios from "axios";
import { withAuthorization } from "../firebase/Session";
import { BACKEND, SIGN_IN, CREATE_CHARACTER, VIEW_CHARACTER } from "../../constants/routes";
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
    imageSrc: "",
    crop: {
        aspect: 1,
        width: 50,
        x: 0,
        y: 0
    },
    pixelCrop: {}
}

class CreateCharacter extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event =>
    {
        const character = this.state.character;
        character[event.target.name] = event.target.value;
        this.setState({ character: character });
    }

    onChangeBasic = event =>
    {
        const character = this.state.character;
        character.basicinfo[event.target.name] = event.target.value;
        this.setState({ character: character });
    }

    onChangeAppearance = event =>
    {
        const character = this.state.character;
        character.appearance[event.target.name] = event.target.value;
        this.setState({ character: character });
    }

    onChangePersonality = event =>
    {
        const character = this.state.character;
        character.personality[event.target.name] = event.target.value;
        this.setState({ character: character });
    }

    onChangeCrop = (crop, pixelCrop) =>
    {
        this.setState({ crop, pixelCrop });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        const { character, pixelCrop, crop } = this.state;

        if (this.imageRef && crop.width && crop.height)
        {
            const canvas = document.createElement('canvas');
            canvas.width = 250;
            canvas.height = 250;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                this.imageRef,
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
                    character.appearance.image = image.url;
                    axios.post(`${BACKEND}${CREATE_CHARACTER}`, { token: localStorage.token, character: character })
                        .then(res =>
                        {
                            this.setState({ ...INITIAL_STATE });
                            this.props.history.push(VIEW_CHARACTER.replace(":character_id", res.data.character._id));
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
    }

    onSelectFile = event =>
    {
        if (event.target.files && event.target.files.length > 0)
        {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ imageSrc: reader.result }),
            );
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onImageLoaded = (image, pixelCrop) =>
    {
        this.imageRef = image;
    };

    render()
    {
        const { character } = this.state;
        const isInvalid = (
            character.name === ""
        );

        return (
            <Container>
                <Form onSubmit={this.onSubmit}>
                    <Grid columns={2} centered stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns={2}>
                                    <Grid.Row columns={1}><Grid.Column>
                                        <Label size="big">General Info</Label>
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                error={isInvalid}
                                                fluid
                                                labelPosition='right corner'
                                                label={{ icon: 'asterisk' }}
                                                name="name"
                                                value={character.name}
                                                onChange={this.onChange}
                                                placeholder="Name" />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Input
                                                fluid
                                                type="number"
                                                name="age"
                                                value={character.basicinfo.age}
                                                onChange={this.onChangeBasic}
                                                placeholder="Age" />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={4}>
                                        <Grid.Column width={8}>
                                            <Input
                                                fluid
                                                name="gender"
                                                value={character.basicinfo.gender}
                                                onChange={this.onChangeBasic}
                                                placeholder="Gender" />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Dropdown
                                                fluid
                                                selection
                                                options={Months}
                                                placeholder="Month" />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Input
                                                fluid
                                                type="number"
                                                min="1"
                                                max="31"
                                                name="birthday"
                                                value={character.basicinfo.birthday}
                                                onChange={this.onChangeBasic}
                                                placeholder="Birthday" />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={1}><Grid.Column>
                                        <TextArea
                                            name="relationships"
                                            value={character.basicinfo.relationships}
                                            onChange={this.onChangeBasic}
                                            placeholder="Relationships" />
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row columns={1}><Grid.Column>
                                        <TextArea
                                            name="backstory"
                                            value={character.basicinfo.backstory}
                                            onChange={this.onChangeBasic}
                                            placeholder="Backstory" />
                                    </Grid.Column></Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column>
                                <Grid columns={1}>
                                    <Grid.Row><Grid.Column>
                                        <Label size="big">Image</Label>
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row><Grid.Column>
                                        <Input
                                            fluid
                                            type="file"
                                            onChange={this.onSelectFile} />
                                        <ReactCrop
                                            src={this.state.imageSrc}
                                            crop={this.state.crop}
                                            onChange={this.onChangeCrop}
                                            onImageLoaded={this.onImageLoaded}
                                            onComplete={this.onCropComplete} />
                                    </Grid.Column></Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns={2}>
                                    <Grid.Row columns={1}><Grid.Column>
                                        <Label size="big">Appearance Info</Label>
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <center>
                                                <p>Hair Color: {character.appearance.hair}</p>
                                                <input
                                                    type="color"
                                                    name="hair"
                                                    value={character.appearance.hair}
                                                    onChange={this.onChangeAppearance}
                                                    placeholder="Hair" />
                                            </center>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <center>
                                                <p>Eye Color: {character.appearance.eyes}</p>
                                                <input
                                                    type="color"
                                                    name="eyes"
                                                    value={character.appearance.eyes}
                                                    onChange={this.onChangeAppearance}
                                                    placeholder="Eyes" />
                                            </center>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={1}><Grid.Column>
                                        <TextArea
                                            name="description"
                                            value={character.appearance.description}
                                            onChange={this.onChangeAppearance}
                                            placeholder="Description" />
                                    </Grid.Column></Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column>
                                <Grid columns={1}>
                                    <Grid.Row columns={1}><Grid.Column>
                                        <Label size="big">Personality Info</Label>
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row><Grid.Column><TextArea
                                        name="traits"
                                        value={character.personality.traits}
                                        onChange={this.onChangePersonality}
                                        placeholder="Traits" />
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row><Grid.Column><TextArea
                                        name="likes"
                                        value={character.personality.likes}
                                        onChange={this.onChangePersonality}
                                        placeholder="Likes" />
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row><Grid.Column><TextArea
                                        name="dislikes"
                                        value={character.personality.dislikes}
                                        onChange={this.onChangePersonality}
                                        placeholder="Dislikes" />
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row><Grid.Column><TextArea
                                        name="habits"
                                        value={character.personality.habits}
                                        onChange={this.onChangePersonality}
                                        placeholder="Habits" />
                                    </Grid.Column></Grid.Row>
                                    <Grid.Row><Grid.Column><TextArea
                                        name="quirks"
                                        value={character.personality.quirks}
                                        onChange={this.onChangePersonality}
                                        placeholder="Quirks" />
                                    </Grid.Column></Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                        <Button disabled={isInvalid} type="submit">Create Character</Button>
                    </Grid>
                </Form>
            </Container>
        );
    }
}

class CreateCharacterButton extends Component
{
    render()
    {
        return (
            <center><Link to={CREATE_CHARACTER}><Button primary>Create Character</Button></Link></center>
        )
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default compose(withAuthorization(condition, badCheck), withRouter)(CreateCharacter);
export { CreateCharacterButton };