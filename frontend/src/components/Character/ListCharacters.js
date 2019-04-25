import React, { Component } from "react";
import axios from "axios";
import { Container, Modal, Button } from "semantic-ui-react";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN, BACKEND, LIST_CHARACTERS, VIEW_CHARACTER, CREATE_CHARACTER } from "../../constants/routes";
import { CharacterGrid } from "./";
import CharacterForm from "./CharacterForm";
import cloudinary from "cloudinary/lib/cloudinary";
import { makeCancelable } from "../../constants/extensions";

const INITIAL_STATE = {
    characters: []
}

class ListCharacters extends Component
{
    promises = [];

    constructor(props)
    {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        this.promises.splice(this.promises.length - 1, 0, makeCancelable(axios.post(`${BACKEND}${LIST_CHARACTERS}`, { token: localStorage.getItem("token") })
            .then(res =>
            {
                this.setState({ characters: res.data.characters });
            })
            .catch(error =>
            {
                console.log(error);
            })));
    }

    componentWillUnmount()
    {
        this.promises.forEach(promise => promise.cancel());
    }

    onSubmit = (state, imageRef) =>
    {
        const { character, pixelCrop, crop } = state;

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

    render()
    {
        return (
            <div>
                <Container>
                    <Modal trigger={<center><Button primary>Create Character</Button></center>}>
                        <Modal.Header>New Character</Modal.Header>
                        <Modal.Content>
                            <CharacterForm onSubmit={this.onSubmit} />
                        </Modal.Content>
                    </Modal>
                    {!!this.state.characters ?
                        <CharacterGrid characters={this.state.characters} />
                        :
                        null
                    }
                </Container>
            </div>
        );
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(ListCharacters);