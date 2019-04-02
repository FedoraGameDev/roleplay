import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Input, Form, Button, Card, Grid, TextArea, Label } from "semantic-ui-react";
import ReactCrop from "react-image-crop";
import axios from "axios";
import { withAuthorization } from "../firebase/Session";
import { BACKEND, SIGN_IN, CREATE_CHARACTER } from "../../constants/routes";

const INITIAL_STATE = {
    character: {
        basicinfo: {
            name: "",
            age: "",
            gender: "",
            birthday: "",
            relationships: "",
            backstory: ""
        },
        appearance: {
            hair: "",
            eyes: "",
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
    }
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

    onChangeSub = event =>
    {
        console.log(event.target.sub);
        const character = this.state.character;
        this.setState({ character: character });
    }

    onChangeCrop = (crop, pixelCrop) =>
    {
        this.setState({ crop });
    }

    onSubmit = event =>
    {
        event.preventDefault();
        console.log(this.state);

        axios.post(`${BACKEND}${CREATE_CHARACTER}`, { token: localStorage.token, character: this.state.character })
            .then(res =>
            {
                console.log(res);
            })
            .catch(error =>
            {
                console.log(error);
            });
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

    onCropComplete = (crop, pixelCrop) =>
    {
        this.makeClientCrop(crop, pixelCrop);
    };

    async makeClientCrop(crop, pixelCrop)
    {
        if (this.imageRef && crop.width && crop.height)
        {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                pixelCrop,
                'newFile.jpeg',
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, pixelCrop, fileName)
    {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        return new Promise((resolve, reject) =>
        {
            canvas.toBlob(blob =>
            {
                if (!blob)
                {
                    //reject(new Error('Canvas is empty'));
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

    render()
    {
        const { character } = this.state;
        const isInvalid = (
            character.name === "" ||
            character.age === "" ||
            character.gender === "" ||
            character.birthday === "" ||
            character.relationships === "" ||
            character.backstory === "" ||
            character.hair === "" ||
            character.eyes === "" ||
            character.description === "" ||
            character.traits === "" ||
            character.likes === "" ||
            character.dislikes === "" ||
            character.habits === "" ||
            character.quirks === ""
        );

        return (
            <Form onSubmit={this.onSubmit}>
                <Grid columns={2} stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid columns={2}>
                                <Grid.Row columns={1}><Grid.Column>
                                    <Label>General Info</Label>
                                </Grid.Column></Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Input fluid sub="basicinfo" name="name" value={character.name} onChange={this.onChangeSub} placeholder="Name" />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Input fluid sub="basicinfo" name="age" value={character.basicinfo.age} onChange={this.onChangeSub} placeholder="Age" />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Input fluid sub="basicinfo" name="gender" value={character.gender} onChange={this.onChangeSub} placeholder="Gender" />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Input fluid sub="basicinfo" name="birthday" value={character.birthday} onChange={this.onChangeSub} placeholder="Birthday" />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1}><Grid.Column>
                                    <TextArea sub="basicinfo" name="relationships" value={character.relationships} onChange={this.onChangeSub} placeholder="Relationships" />
                                </Grid.Column></Grid.Row>
                                <Grid.Row columns={1}><Grid.Column>
                                    <TextArea sub="basicinfo" name="backstory" value={character.backstory} onChange={this.onChangeSub} placeholder="Backstory" />
                                </Grid.Column></Grid.Row>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid columns={1}>
                                <Grid.Row><Grid.Column>
                                    <Label>Image</Label>
                                </Grid.Column></Grid.Row>
                                <Grid.Row><Grid.Column>
                                    {this.state.imageSrc ?
                                        <ReactCrop
                                            src={this.state.imageSrc}
                                            crop={this.state.crop}
                                            onChange={this.onChangeCrop}
                                            onImageLoaded={this.onImageLoaded}
                                            onComplete={this.onCropComplete} /> :
                                        <Input fluid type="file" onChange={this.onSelectFile} />}
                                </Grid.Column></Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Grid columns={2}>
                                <Grid.Row columns={1}><Grid.Column>
                                    <Label>Appearance Info</Label>
                                </Grid.Column></Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Input fluid sub="appearance" name="hair" value={character.hair} onChange={this.onChangeSub} placeholder="Hair" />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Input fluid sub="appearance" name="eyes" value={character.eyes} onChange={this.onChangeSub} placeholder="Eyes" />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={1}><Grid.Column>
                                    <TextArea sub="appearance" name="description" value={character.description} onChange={this.onChangeSub} placeholder="Description" />
                                </Grid.Column></Grid.Row>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid columns={1}>
                                <Grid.Row columns={1}><Grid.Column>
                                    <Label>Personality Info</Label>
                                </Grid.Column></Grid.Row>
                                <Grid.Row><Grid.Column><TextArea sub="personality" name="traits" value={character.traits} onChange={this.onChange} placeholder="Traits" /></Grid.Column></Grid.Row>
                                <Grid.Row><Grid.Column><TextArea sub="personality" name="likes" value={character.likes} onChange={this.onChange} placeholder="Likes" /></Grid.Column></Grid.Row>
                                <Grid.Row><Grid.Column><TextArea sub="personality" name="dislikes" value={character.dislikes} onChange={this.onChange} placeholder="Dislikes" /></Grid.Column></Grid.Row>
                                <Grid.Row><Grid.Column><TextArea sub="personality" name="habits" value={character.habits} onChange={this.onChange} placeholder="Habits" /></Grid.Column></Grid.Row>
                                <Grid.Row><Grid.Column><TextArea sub="personality" name="quirks" value={character.quirks} onChange={this.onChange} placeholder="Quirks" /></Grid.Column></Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Button disabled={isInvalid} type="submit">Create Character</Button>
                </Grid>
            </Form>
        );
    }
}

class CreateCharacterButton extends Component
{
    render()
    {
        return (
            <Link to={CREATE_CHARACTER}>Create Character</Link>
        )
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(CreateCharacter);
export { CreateCharacterButton };