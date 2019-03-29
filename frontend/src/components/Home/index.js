import React from "react";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN } from "../../constants/routes";

class HomePage extends React.Component
{
    render()
    {
        return (
            <div>
                <h1>Home Page</h1>
                <p>Hello {this.props.userInfo.user.username}</p>
            </div>
        );
    }
}

const condition = authUser => !!authUser;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(HomePage);