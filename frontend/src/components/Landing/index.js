import React from "react";
import { Segment, Header, Message } from "semantic-ui-react";
import { withAuthStatic } from "../firebase/Session";

class Landing extends React.Component
{
    render()
    {
        return (
            <Segment>
                {
                    this.props.userInfo ?
                        <Message>
                            <Message.Header>
                                I see you've logged in. Head over to the characters page to create a character. Or, if you would like to see the stories, go to that page.
                            </Message.Header>
                        </Message>
                        :
                        <Message>
                            <Message.Header>
                                Head over to the log in page and click 'Sign Up' to create a new account.
                            </Message.Header>
                        </Message>
                }
                <Header as="h1"><center>Welcome to the roleplay website!</center></Header>
                <Header as="h3" style={{ color: "red" }}><center>Note: this site is in beta.</center></Header>
                <Message>
                    <Message.Header>A few things to keep in mind</Message.Header>
                    <Message.List>
                        <Message.Item>This site is subject to change.</Message.Item>
                        <Message.Item>The backend is not in its final state, so some stories may not survive. Only start stories for testing purposes for now.</Message.Item>
                        <Message.Item>Log in to get the link for reporting bugs.</Message.Item>
                        <Message.Item>You may add suggestions to the bug reporting page, as well.</Message.Item>
                    </Message.List>
                </Message>
                <Message>
                    <Message.Header>
                        The purpose of this site is to bring the community to a well-formatted site for roleplaying.
                    It was built on React to have a modern, snappy front-end experience. I am a solo developer, however, so updates may take time.
                    I will keep all user suggestions in mind while building more features into the site.
                    </Message.Header>
                </Message>
                <Message>
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
        )
    }
}

export default withAuthStatic(Landing);