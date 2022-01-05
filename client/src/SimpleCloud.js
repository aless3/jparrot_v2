import React from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { TagCloud } from "react-tagcloud";

export function SimpleCloud ({values}){

    const navigate = useNavigate();

    const redirect = (value) => {
        let keyword = value || "covid";
        navigate('/', { state: { prevKeyword: keyword } });
    }

    return (
        <TagCloud
            minSize={10}
            maxSize={60}
            tags={values}
            shuffle={true}
            onClick={(tag) => redirect(tag.value)}
        />
    );
}