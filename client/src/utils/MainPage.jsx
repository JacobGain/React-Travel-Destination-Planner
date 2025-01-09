import React, { useState, useRef } from "react";
import { NavigationBar } from "./NavigationBar";
import { searchDestinations, changePage } from "./UnauthorizedFunctionality";
import { createList, deleteList, addDestinationsToList } from "./AuthorizedFunctionality";
import { useLocation } from "react-router-dom";

const MainPage = () => {
    // State for list management
    const [listName, setListName] = useState("");
    const [listDescription, setListDescription] = useState("");
    const [visibility, setListVisibility] = useState("private");
    const [destinationNames, setDestinationNames] = useState("");
    const resultsContainerRef = useRef(null);

    // State for destination search
    const [searchField, setSearchField] = useState("Country");
    const [searchPattern, setSearchPattern] = useState("");
    const [results, setResults] = useState([]);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);

    const { state } = useLocation();
    const isGuest = state?.isGuest || false;
    //const userEmail = localStorage.getItem("userEmail");

    // Handle destination details fetching
    const fetchDestinationDetails = async (destinationId) => {
        try {
            const response = await fetch(`/api/open/destinations/${destinationId}`, { method: "GET" });

            if (!response.ok) {
                throw new Error(`Failed to fetch destination details: ${response.statusText}`);
            }

            const fullDetails = await response.json();

            setResults((prevResults) =>
                prevResults.map((dest) =>
                    dest.id === destinationId ? { ...dest, fullDetails, expanded: !dest.expanded } : dest
                )
            );
        } catch (err) {
            console.error("Error fetching destination details:", err);
            setError("An error occurred while fetching destination details. Please try again.");
        }
    };

    // Handle search functionality
    const handleSearch = async () => {
        const resultsPerPage = 5; // Define results per page
        await searchDestinations(searchField, searchPattern, resultsPerPage, setResults, setPages, setError);
        setCurrentPage(0); // Reset to the first page
    };

    const handlePageChange = (direction) => {
        changePage(pages, direction, currentPage, setCurrentPage, setResults);
    };

    // Handle list functionality (create, delete, add destinations)
    const handleCreateList = async () => {
        try {
            const resultsContainer = resultsContainerRef.current;
            await createList(listName, listDescription, visibility, resultsContainer);
            alert("List created successfully!");
        } catch (err) {
            console.error("Error creating list:", err);
            setError("An error occurred while creating the list. Please try again.");
        }
    };

    const handleDeleteList = async () => {
        try {
            const resultsContainer = resultsContainerRef.current;
            await deleteList(listName, resultsContainer);
            alert("List deleted successfully!");
        } catch (err) {
            console.error("Error deleting list:", err);
            setError("An error occurred while deleting the list. Please try again.");
        }
    };

    const handleAddDestinations = async () => {
        try {
            const resultsContainer = resultsContainerRef.current;
            await addDestinationsToList(destinationNames, listName, resultsContainer);
            alert("Destinations added to the list successfully!");
        } catch (err) {
            console.error("Error adding destinations:", err);
            setError("An error occurred while adding destinations. Please try again.");
        }
    };



    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <NavigationBar />
            <h1>Welcome to the Europe Destination Planner</h1>
            {isGuest && <p>You are browsing as a guest. Some features are limited.</p>}

            {/* Destination Search Section */}
            <div>
                <h2>Search Destinations</h2>
                <select value={searchField} onChange={(e) => setSearchField(e.target.value)} style={styles.button}>
                    <option value="Country">Country</option>
                    <option value="Region">Region</option>
                    <option value="Destination">Destination</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter search pattern"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                    style={styles.searchField}
                />
                <button onClick={handleSearch} style={styles.button}>Search</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div id="search-results">
                    {results.length > 0 ? (
                        results.map((result, idx) => (
                            <div key={idx} style={styles.resultItem}>
                                <strong>{result.Destination}</strong> - {result.Country} 
                                <button
                                    onClick={() => fetchDestinationDetails(result.id)}
                                    style={styles.button}
                                >
                                    {result.expanded ? "Hide Info" : "Show Info"}
                                </button>
                                <a
                                    href={`https://duckduckgo.com/${result.Destination}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.ddgLink}
                                >
                                    Search on DDG
                                </a>
                                {result.expanded && result.fullDetails && (
                                    <div style={styles.destinationDetails}>
                                        <p><strong>Region:</strong> {result.fullDetails.Region || "No information available"}</p>
                                        <p><strong>Category:</strong> {result.fullDetails.Category || "No information available"}</p>
                                        <p><strong>Latitude:</strong> {result.fullDetails.Latitude || "No information available"}</p>
                                        <p><strong>Longitude:</strong> {result.fullDetails.Longitude || "No information available"}</p>
                                        <p><strong>Tourists:</strong> {result.fullDetails.ApproxAnnualTourists || "No information available"}</p>
                                        <p><strong>Currency:</strong> {result.fullDetails.Currency || "No information available"}</p>
                                        <p><strong>Religion:</strong> {result.fullDetails.MajorityReligion || "No information available"}</p>
                                        <p><strong>Famous Foods:</strong> {result.fullDetails.FamousFoods || "No information available"}</p>
                                        <p><strong>Language:</strong> {result.fullDetails.Language || "No information available"}</p>
                                        <p><strong>Best Time to Visit:</strong> {result.fullDetails.BestTimeToVisit || "No information available"}</p>
                                        <p><strong>Cost of Living:</strong> {result.fullDetails.CostOfLiving || "No information available"}</p>
                                        <p><strong>Safety:</strong> {result.fullDetails.Safety || "No information available"}</p>
                                        <p><strong>Cultural Significance:</strong> {result.fullDetails.CulturalSignificance || "No information available"}</p>
                                        <p><strong>Description:</strong> {result.fullDetails.Description || "No description available"}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        !error && <p>No results found.</p>
                    )}
                </div>
                <button onClick={() => handlePageChange(-1)} style={styles.button}>Previous</button>
                <button onClick={() => handlePageChange(1)} style={styles.button}>Next</button>
            </div>

            {/* List Management Section (only for non-guests) */}
            {!isGuest && (
                <div>
                    <div id="list-section">
                        <h2>Manage Favourite Lists</h2>
                        <select
                            name="visibility"
                            value={visibility}
                            onChange={(e) => setListVisibility(e.target.value)}
                            style={styles.button}
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                        <input
                            type="text"
                            id="list-name"
                            placeholder="Enter list name"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            style={styles.inputField}
                        />
                        <input
                            type="text"
                            id="list-description"
                            placeholder="Enter list description"
                            value={listDescription}
                            onChange={(e) => setListDescription(e.target.value)}
                            style={styles.inputField}
                        />
                        <button onClick={handleCreateList} style={styles.button}>Create List</button>
                        <button onClick={handleDeleteList} style={styles.button}>Delete List</button>
                        <br />
                        <input
                            type="text"
                            id="destination-names"
                            placeholder="Enter destination names"
                            value={destinationNames}
                            onChange={(e) => setDestinationNames(e.target.value)}
                            style={styles.inputField}
                        />
                        <button onClick={handleAddDestinations} style={styles.button}>Add Destinations to List</button>
                        <div id="lists-display" ref={resultsContainerRef}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;

const styles = {
    resultItem: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        margin: "15px 0",
        backgroundColor: "#f9f9f9",
        textAlign: "left",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    destinationDetails: {
        marginTop: "10px",
        padding: "15px",
        backgroundColor: "#e9ecef",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "0.95rem",
        lineHeight: "1.6",
    },
    button: {
        padding: "10px 20px",
        margin: "10px",
        backgroundColor: "#ED2939",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "0.95rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    searchButtonHover: {
        backgroundColor: "#7COA02", // Slightly darker for hover
    },
    ddgLink: {
        color: "#7COA02",
        textDecoration: "none",
        marginLeft: "10px",
        fontSize: "0.9rem",
        fontWeight: "bold",
        transition: "color 0.3s ease",
    },
    searchField: {
        padding: "10px 20px",
        margin: "10px",
        fontSize: "0.95rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
        width: "400px", // Adjust width to align well with button
        transition: "border-color 0.3s ease",
    },
    inputField: {
        padding: "10px 20px",
        margin: "10px",
        fontSize: "0.95rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
        width: "200px", // Adjust width to align well with button
        transition: "border-color 0.3s ease",
    }
};
