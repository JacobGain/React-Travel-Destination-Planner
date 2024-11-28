import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { retrieveList, getJWTtoken } from "./AuthorizedFunctionality";
import { NavigationBar } from "./NavigationBar"

const PrivateListPage = () => {
    const location = useLocation();
    const isGuest = location.state?.isGuest || false;

    const userEmail = localStorage.getItem("userEmail")

    return (
        <div>
            <NavigationBar />
            <div>HELLO WORLD 123!</div>
            <div>{userEmail}</div>
        </div>
    );

}

export default PrivateListPage;