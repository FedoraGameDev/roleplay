import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../firebase/Session";
import Navigation from "../Navigation";
import Landing from "../Landing";
import SignUp from "../firebase/SignUp";
import SignIn from "../firebase/SignIn";
import PasswordForget from "../firebase/PasswordForget";
import Home from "../Home";
import Account from "../Account";
import Admin from "../Admin";
import { Story, Genre, CreateStory } from "../Story";

class App extends React.Component
{
    render()
    {
        return (
            <Router>
                <div>
                    <Navigation />

                    <hr />

                    <Route exact path={ROUTES.LANDING} component={Landing} />
                    <Route path={ROUTES.SIGN_UP} component={SignUp} />
                    <Route path={ROUTES.SIGN_IN} component={SignIn} />
                    <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                    <Route path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.ACCOUNT} component={Account} />
                    <Route path={ROUTES.ADMIN} component={Admin} />
                    <Route exact path={ROUTES.STORY} component={Story} />
                    <Route path={ROUTES.CREATE_STORY} component={CreateStory} />
                    <Route path={ROUTES.GENRE} component={Genre} />
                </div>
            </Router>
        );
    }
}

export default withAuthentication(App);