import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Table } from "semantic-ui-react";

class ChapterView extends Component
{
    render()
    {
        return (
            <Table><Table.Body></Table.Body></Table>
        );
    }
}

export default withRouter(ChapterView);