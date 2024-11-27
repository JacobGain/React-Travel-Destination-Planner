import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    createList,
    retrieveList,
    deleteList,
    addDestinationsToList,
    sortDisplayedList,
} from "./AuthorizedFunctionality";

const MainPage = () => {
    const location = useLocation();
    const isGuest = location.state?.isGuest || false;
    const user = location.state?.user || null;

    const [listName, setListName] = useState("");
    const [destinationNames, setDestinationNames] = useState("");
    const resultsContainerRef = useRef(null); // Reference for results container

    // Wrapping imported functions to pass arguments
    const handleCreateList = () =>
        createList(listName, resultsContainerRef.current);
    const handleRetrieveList = () =>
        retrieveList(listName, resultsContainerRef.current);
    const handleDeleteList = () =>
        deleteList(listName, resultsContainerRef.current);
    const handleAddDestinations = () =>
        addDestinationsToList(destinationNames, listName, resultsContainerRef.current);
    const handleSortList = (event) =>
        sortDisplayedList(event.target, listName, resultsContainerRef.current);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Europe Destination Planner</h1>
            {isGuest ? (
                <p>You are browsing as a guest. Some features are limited.</p>
            ) : (
                <div>
                    <p>
                        Welcome back, <strong>{user}</strong>! Enjoy full access to the planner.
                    </p>
                    <div id="list-section">
                        <h2>Manage Favourite Lists</h2>
                        <input
                            type="text"
                            id="list-name"
                            placeholder="Enter list name"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                        />
                        <button onClick={handleCreateList}>Create List</button>
                        <button onClick={handleRetrieveList}>Retrieve List</button>
                        <button onClick={handleDeleteList}>Delete List</button>
                        <br />
                        <input
                            type="text"
                            id="destination-names"
                            placeholder="Enter destination names"
                            value={destinationNames}
                            onChange={(e) => setDestinationNames(e.target.value)}
                        />
                        <button onClick={handleAddDestinations}>
                            Add Destinations to List
                        </button>
                        <div id="sort-section">
                            <label htmlFor="sort-field">Sort By:</label>
                            <select id="sort-field" onChange={handleSortList}>
                                <option value="Destination">Name</option>
                                <option value="Region">Region</option>
                                <option value="Country">Country</option>
                            </select>
                        </div>
                        <div id="lists-display" ref={resultsContainerRef}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;
