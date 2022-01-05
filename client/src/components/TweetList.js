import React from 'react'
import { Card } from 'react-bootstrap';

const TweetList = (props) => {
    const elementi = props.elementi;
    const lista = elementi.map((elemento) =>
            <Card className="my-2 p-3">
                <Card.Body>
                <li>{elemento}</li>          
                </Card.Body>
            </Card>
    );
    return (
        <>
        <ul>{lista}</ul>
        </>
    )
}

export default TweetList
