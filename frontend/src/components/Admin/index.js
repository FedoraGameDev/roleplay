import React from "react";
import * as ROLES from "../../constants/roles";
import { withAuthorization } from "../firebase/Session";

const AdminPage = () =>
    (
        <div>
            <h1>Admin</h1>
        </div>
    );

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(condition)(AdminPage);