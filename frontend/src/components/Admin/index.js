import React from "react";
import { withAuthorization } from "../firebase/Session";
import * as ROUTES from "../../constants/routes";

class AdminPage extends React.Component
{
    constructor(props)
    {
        super(props);
        console.log(this.props);
    }

    render()
    {
        return (
            <div>
                <h1>Admin</h1>
            </div>
        )
    }
}

const condition = userInfo => (userInfo && userInfo.user.roles.includes("Admin"));
const badCheck = (history) => history.push(ROUTES.SIGN_IN);

export default withAuthorization(condition, badCheck)(AdminPage);