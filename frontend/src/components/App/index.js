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
import NavLinkContext from "../Navigation/context";

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            menuTarget: "home"
        };
    }

    goToLink = (to, history) =>
    {
        this.setTarget(to);
        history.push(to);
    }

    setTarget = (to) =>
    {
        if (to.includes("home")) this.setState({ menuTarget: "home" });
        if (to.includes("account")) this.setState({ menuTarget: "account" });
        if (to.includes("story")) this.setState({ menuTarget: "story" });
        if (to.includes("character")) this.setState({ menuTarget: "character" });
        if (to === "/") this.setState({ menuTarget: "landing" });
        if (to.includes("signin")) this.setState({ menuTarget: "signin" });
    }

    render()
    {
        const navlink = {
            goToLink: this.goToLink,
            setTarget: this.setTarget,
            menuTarget: this.state.menuTarget
        };

        return (
            <Router>
                <NavLinkContext.Provider value={navlink}>
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
                </NavLinkContext.Provider>
            </Router>
        );
    }
}

export default compose(withAuthentication)(App);