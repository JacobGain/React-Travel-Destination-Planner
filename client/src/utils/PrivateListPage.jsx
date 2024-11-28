import React, { useState, useEffect } from "react";
import { NavigationBar } from "./NavigationBar";
import { getJWTToken } from "./AuthorizedFunctionality";

const PrivateListPage = () => {
    const userEmail = localStorage.getItem("userEmail");
    const [lists, setLists] = useState([]); // Store list names
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLists = async () => {
        try {
            // Fetch list names associated with the user
            const response = await fetch(`/api/secure/lists/getlists/${userEmail}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getJWTToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch lists: ${response.statusText}`);
            }

            const listNames = await response.json(); // Get list names
            setLists(listNames.map(listName => ({ listName, expanded: false, details: null }))); // Initialize state
        } catch (err) {
            console.error("Error fetching lists:", err);
            setError("An error occurred while fetching your lists. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchListDetails = async (listName) => {
        try {
            const response = await fetch(`/api/secure/lists/getinfo/${listName}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getJWTToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch details for list "${listName}"`);
            }

            const details = await response.json();
            setLists(prevLists =>
                prevLists.map(list =>
                    list.listName === listName ? { ...list, details, expanded: !list.expanded } : list
                )
            );
        } catch (err) {
            console.error(`Error fetching details for list "${listName}":`, err);
            setError("An error occurred while fetching list details. Please try again.");
        }
    };

    useEffect(() => {
        fetchLists();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <NavigationBar />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Your Private Lists</h2>
                {loading ? (
                    <p>Loading your lists...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : lists.length > 0 ? (
                    lists.map((list, index) => (
                        <div key={index} style={styles.listContainer}>
                            <h3>{list.listName}</h3>
                            <button onClick={() => fetchListDetails(list.listName)}>
                                {list.expanded ? "Hide Details" : "Show More"}
                            </button>
                            {list.expanded && list.details && (
                                <div>
                                    <p><strong>Description:</strong> {list.details.description}</p>
                                    <ul style={{ listStyleType: "none", padding: 0 }}>
                                        {list.details.destinations.map((destination, idx) => (
                                            <li key={idx} style={styles.listItem}>
                                                <strong>{destination.Destination}</strong> - {destination.Country}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>You have no lists. Start by creating one!</p>
                )}
            </div>
        </div>
    );
};

export default PrivateListPage;

// Inline styles
const styles = {
    listContainer: {
        margin: "10px 0",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
    },
    listItem: {
        margin: "5px 0",
        padding: "5px",
        borderBottom: "1px solid #ddd",
    },
};
