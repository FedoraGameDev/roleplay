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
        this.promises.splice(this.promises.length - 1, 0,
            makeCancelable(axios.get(`https://www.thecolorapi.com/id?format=json&hex=${this.props.color.replace("#", "")}`)
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
        const { story } = this.props;
        const date = new Date(story.date_created);
        const { backgroundColor, fontColor } = this.state;
        const dateCreated = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

        return (
            <Card
                link
                className={`book-card`}
                style={{ width: "150px", height: "175px", backgroundImage: `url(${BookCover})`, backgroundSize: "150px auto" }}
                onClick={() => { this.goToPage(STORY_VIEW.replace(":story_id", story._id)); }}>
                {
                    <div className="content" style={{ backgroundColor, fontColor, display: "flex", alignItems: "center" }}>
                        <div>
                            <Header><span style={{ fontColor }}>{story.title}</span></Header>
                            <i>{story.author.username}</i><br />
                            {dateCreated}
                        </div>
                    </div>
                }
            </Card>
        )
    }
}

export default withRouter(Book);