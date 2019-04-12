import React, { Component } from "react";
import { withFirebase } from "../Firebase";

class SignOutButton extends Component
{
    render()
    {
        return (
            <a href="#" onClick={event => { event.preventDefault(); this.props.firebase.doSignOut(); }}>Sign Out</a>
        );
    }
}

// const SignOutButton = ({ firebase }) => (
//     <button type="button" onClick={firebase.doSignOut}>Sign Out</button>
// );

export default withFirebase(SignOutButton);