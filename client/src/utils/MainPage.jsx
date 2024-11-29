import React, { useState, useRef } from "react";
import { NavigationBar } from "./NavigationBar";
import { searchDestinations, changePage } from "./UnauthorizedFunctionality";

const MainPage = ({ isGuest }) => {
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
    const handleCreateList = () => {
        console.log("Creating list:", { listName, listDescription, visibility });
    };

    const handleDeleteList = () => {
        console.log("Deleting list:", listName);
    };

    const handleAddDestinations = () => {
        console.log("Adding destinations:", destinationNames);
    };



    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <NavigationBar />
            <h1>Welcome to the Europe Destination Planner</h1>
            {isGuest && <p>You are browsing as a guest. Some features are limited.</p>}

            {/* Destination Search Section */}
            <div>
                <h2>Search Destinations</h2>
                <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                    <option value="Country">Country</option>
                    <option value="Region">Region</option>
                    <option value="Destination">Destination</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter search pattern"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div id="search-results">
                    {results.length > 0 ? (
                        results.map((result, idx) => (
                            <div key={idx} style={styles.resultItem}>
                                <strong>{result.Destination}</strong> - {result.Country}
                                <button
                                    onClick={() => fetchDestinationDetails(result.id)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    {result.expanded ? "Hide Info" : "Show Info"}
                                </button>
                                <a
                                    href={`https://duckduckgo.com/${result.Destination}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginLeft: "10px" }}
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
                        !error && <p>No results found. Try a different search pattern.</p>
                    )}
                </div>
                <button onClick={() => handlePageChange(-1)}>Previous</button>
                <button onClick={() => handlePageChange(1)}>Next</button>
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
                        />
                        <input
                            type="text"
                            id="list-description"
                            placeholder="Enter list description"
                            value={listDescription}
                            onChange={(e) => setListDescription(e.target.value)}
                        />
                        <button onClick={handleCreateList}>Create List</button>
                        <button onClick={handleDeleteList}>Delete List</button>
                        <br />
                        <input
                            type="text"
                            id="destination-names"
                            placeholder="Enter destination names"
                            value={destinationNames}
                            onChange={(e) => setDestinationNames(e.target.value)}
                        />
                        <button onClick={handleAddDestinations}>Add Destinations to List</button>
                        <div id="lists-display" ref={resultsContainerRef}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    resultItem: {
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
        margin: "10px 0",
        backgroundColor: "#f9f9f9",
        textAlign: "left",
    },
    destinationDetails: {
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#f1f1f1",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
};

export default MainPage;
