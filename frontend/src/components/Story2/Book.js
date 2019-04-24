import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Card, Header, Loader } from "semantic-ui-react";
import { STORY_VIEW } from "../../constants/routes";
import BookCover from "../../images/bookCover.jpg";
import { makeCancelable } from "../../constants/extensions";
import StoryList from "./StoryList";

const INITIAL_STATE = {
    backgroundColor: "#FFFFFF55",
    fontColor: "black"
}

class Book extends Component
{
    promises = [];

    constructor(props)
    {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount()
    {
        if (this.props.story)
            this.promises.splice(this.promises.length - 1, 0,
                makeCancelable(axios.get(`https://www.thecolorapi.com/id?format=json&hex=${this.props.story.color.replace("#", "")}`)
                    .then(res =>
                    {
                        this.setState({ backgroundColor: `${res.data.name.closest_named_hex}55`, fontColor: res.data.contrast.value });
                    })
                    .catch(error =>
                    {
                        console.log(error);
                    })));
    }

    componentWillUnmount()
    {
        this.promises.forEach(promise => promise.cancel());
    }

    /* goToPage
     * Open link 'to'
    */
    goToPage = (to) =>
    {
        this.props.history.push(to);
    }

    render()
    {
        const { story, loader } = this.props;
        const date = story ? new Date(story.date_created) : null;
        const { backgroundColor, fontColor } = this.state;
        const dateCreated = date ? `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}` : null;

        return (
            <Card
                link
                className={`book-card`}
                style={{
                    width: "150px",
                    height: "175px",
                    backgroundImage: `url(${BookCover})`,
                    color: fontColor,
                    backgroundSize: "150px auto"
                }}
                onClick={() => { if (!loader) this.goToPage(STORY_VIEW.replace(":story_id", story._id)); }}>
                {
                    <div className="content" style={{ backgroundColor, color: fontColor, display: "flex", alignItems: "center" }}>
                        {
                            loader ?
                                <Loader active />
                                :
                                <div style={{ width: "100%" }}>
                                    <Header style={{ color: fontColor }}>{story.title}</Header>
                                    <i>{story.author.username}</i> <br />
                                    {dateCreated}
                                </div>
                        }
                    </div>
                }
            </Card>
        )
    }
}

export default withRouter(Book);