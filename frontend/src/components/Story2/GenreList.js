import React, { Component } from "react";
import { Card, Checkbox } from "semantic-ui-react";

class GenreList extends Component
{
    render()
    {
        const { genres, onChange, selections } = this.props;

        return (
            <Card.Group centered>
                {
                    genres.map((genre, index) =>
                        (
                            <Card key={index} style={{ width: "auto", padding: "5px 10px" }}>
                                <Checkbox
                                    toggle
                                    name={genre.name}
                                    label={genre.name}
                                    checked={selections && selections[genre.name]}
                                    // defaultChecked={selections && selections[genre.name]}
                                    onChange={event => { onChange(genre.name) }} />
                            </Card>
                        ))
                }
            </Card.Group>
        );
    }
}

export default GenreList;