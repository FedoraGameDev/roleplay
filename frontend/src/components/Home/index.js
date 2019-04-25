import React from "react";
import { withAuthorization } from "../firebase/Session";
import { SIGN_IN } from "../../constants/routes";
import { Segment, Message, Header } from "semantic-ui-react";

class HomePage extends React.Component
{
    render()
    {
        return (
            <Segment>
                <Header as="h1"><center>Welcome, {this.props.userInfo.user.username}!</center></Header>
                <Message attached="top"><Message.Header><center style={{ color: "red" }}>Note: this site is in beta.</center></Message.Header></Message>
                <Message attached>
                    <Message.Header>A few things to keep in mind</Message.Header>
                    <Message.List>
                        <Message.Item>This site is subject to change.</Message.Item>
                        <Message.Item>The backend is not in its final state, so some stories may not survive. Only start stories for testing purposes for now.</Message.Item>
                        <Message.Item>If you encounter any bugs, please report them <a href="https://github.com/FedoraGameDev/roleplay/issues/new" target="_blank">Here</a> (requires free Github account)</Message.Item>
                        <Message.Item>You may add suggestions to the bug reporting page, as well.</Message.Item>
                    </Message.List>
                </Message>
                <Message attached>
                    <Message.Header>
                        Feel free to poke around the site and try some things out. If you think of any additions that you would like to see,
                        Add them to the bug tracker as a feature.
                    </Message.Header>
                </Message>
                <Message attached="bottom">
                    <Message.Header>Planned Features</Message.Header>
                    <Message.List>
                        <Message.Item>Mobile-friendly interface</Message.Item>
                        <Message.Item>Chapter locks</Message.Item>
                        <Message.Item>Story search bar</Message.Item>
                        <Message.Item>BB code support</Message.Item>
                        <Message.Item>Notifications</Message.Item>
                        <Message.Item>Some other stuff I can't think of right now.</Message.Item>
                    </Message.List>
                </Message>
            </Segment>
        );
    }
}

const condition = authUser => !!authUser;
const badCheck = history => history.push(SIGN_IN);

export default withAuthorization(condition, badCheck)(HomePage);