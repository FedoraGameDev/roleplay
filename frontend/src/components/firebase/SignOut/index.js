import React, { Component } from "react";
import { withFirebase } from "../Firebase";

class SignOutButton extends Component
{
    SignOut()
    {
        this.props.firebase.doSignOut();
    }

    render()
    {
        return (
            <button className="as-anchor" onClick={event => { event.preventDefault(); this.props.firebase.doSignOut(); }}>Sign Out</button>
        );
    }
}

export default withFirebase(SignOutButton);