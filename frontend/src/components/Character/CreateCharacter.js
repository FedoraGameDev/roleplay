import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Button, Container } from "semantic-ui-react";
import 'react-image-crop/lib/ReactCrop.scss';
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN, CREATE_CHARACTER } from "../../constants/routes";
import CharacterForm from "./CharacterForm";

class CreateCharacter extends Component
{
    render()
    {
        return (
            <Container>
                <CharacterForm />
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