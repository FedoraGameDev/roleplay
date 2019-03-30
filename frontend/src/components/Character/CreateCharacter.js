import React, { Component } from "react";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN } from "../../constants/routes";

class CreateCharacter extends Component
{
    render()
    {
        return (
            <div>Create Character</div>
        );
    }
}

const condition = userInfo => !!userInfo;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(CreateCharacter);