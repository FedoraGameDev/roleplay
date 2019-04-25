import React, { Component } from "react"
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Input, Form, Button, Grid, TextArea, Label } from "semantic-ui-react";
import ReactCrop from "react-image-crop";
import cloudinary from "cloudinary/lib/cloudinary";
import axios from "axios";
import Months from "../../constants/months";
import { withAuthorization } from "../firebase/Session";
import { BACKEND, SIGN_IN, CREATE_CHARACTER, VIEW_CHARACTER } from "../../constants/routes";

const INITIAL_STATE = {
    character: {
        name: "",
        basicinfo: {
            age: 0,
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
    pixelCrop: {},
    hasSubmittedAtLeastOnce: false
}

class CharacterForm extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        if (this.props.character)
            this.setState({ character: this.props.character });
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
        this.setState({ hasSubmittedAtLeastOnce: true });
        this.props.onSubmit(this.state, this.imageRef);
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

    MonthsDropdown = info =>
    {
        const { myself } = info.info;
        const { character } = myself.state;

        const monthElements = Months.map((month, index) =>
            (
                <option value={month.key} key={index}>{month.text}</option>
            ));

        return (
            <select name="birthmonth" placeholder="Month" value={character.basicinfo.birthmonth} onChange={myself.onChangeBasic}>{monthElements}</select>
        )
    }

    render()
    {
        const { character, hasSubmittedAtLeastOnce } = this.state;
        const { actionName } = this.props;
        const isInvalid = (
            character.name === "" ||
            character.age === null
        );

        return (
            <Form onSubmit={this.onSubmit}>
                <Grid columns={2} centered stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid columns={2} stackable>
                                <Grid.Row columns={1}><Grid.Column>
                                    <center><Label size="big">General Info</Label></center>
                                </Grid.Column></Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Input
                                            error={hasSubmittedAtLeastOnce && character.name === ""}
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
                                            error={hasSubmittedAtLeastOnce && character.age === null}
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
                                        <this.MonthsDropdown info={{ myself: this }} />
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
                                    <center><Label size="big">Image</Label></center>
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
                                    <center><Label size="big">Appearance Info</Label></center>
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
                                    <center><Label size="big">Personality Info</Label></center>
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
                    <Button disabled={isInvalid} type="submit" primary>{actionName}</Button>
                </Grid>
            </Form>
        );
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default compose(withAuthorization(condition, badCheck), withRouter)(CharacterForm);