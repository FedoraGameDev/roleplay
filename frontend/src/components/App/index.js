import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../firebase/Session";
import { compose } from "recompose";
import Navigation from "../Navigation";
import Landing from "../Landing";
import SignUp from "../firebase/SignUp";
import SignIn from "../firebase/SignIn";
import PasswordForget from "../firebase/PasswordForget";
import Home from "../Home";
import Account from "../Account";
import Admin from "../Admin";
import { Segment, Container } from "semantic-ui-react";
import { CreateStory, CreateChapter } from "../Story";
import { StoryContainer } from "../Story2";
import { ListCharacters, ViewCharacter, CreateCharacter } from "../Character";

class App extends React.Component
{
    render()
    {
        return (
            <Router>
                <Container>
                    <Navigation />
                    <Segment attached="bottom">
                        <Route exact path={ROUTES.LANDING} component={Landing} />
                        <Route path={ROUTES.SIGN_UP} component={SignUp} />
                        <Route path={ROUTES.SIGN_IN} component={SignIn} />
                        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
                        <Route path={ROUTES.HOME} component={Home} />
                        <Route path={ROUTES.ACCOUNT} component={Account} />
                        <Route path={ROUTES.ADMIN} component={Admin} />

                        <Route path={ROUTES.STORY_CONTAINER} component={StoryContainer} />

                        <Route path={ROUTES.CREATE_STORY} component={CreateStory} />
                        <Route path={ROUTES.CREATE_CHAPTER} component={CreateChapter} />

                        <Route path={ROUTES.LIST_CHARACTERS} component={ListCharacters} />
                        <Route path={ROUTES.VIEW_CHARACTER} component={ViewCharacter} />
                        <Route path={ROUTES.CREATE_CHARACTER} component={CreateCharacter} />
                    </Segment>
                </Container>
            </Router>
        );
    }
}

export default compose(withAuthentication)(App);