import React, { useState, useEffect } from "react";
import { NavigationBar } from "./NavigationBar";
import { getJWTToken } from "./AuthorizedFunctionality";
import { useNavigate } from "react-router-dom";

const PrivateListPage = () => {
    const navigate = useNavigate();
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
                    list.listName === listName
                        ? {
                            ...list,
                            details: {
                                description: details.listDescription,
                                visibility: details.listVisibility,
                                destinations: details.destinations.map(dest => ({
                                    ...dest,
                                    expanded: false,
                                    fullDetails: null,
                                })),
                            },
                            expanded: !list.expanded,
                        }
                        : list
                )
            );
        } catch (err) {
            console.error(`Error fetching details for list "${listName}":`, err);
            setError("An error occurred while fetching list details. Please try again.");
        }
    };

    const fetchDestinationDetails = async (listName, destinationId) => {
        try {
            const response = await fetch(`/api/open/destinations/${destinationId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch details for destination ID "${destinationId}"`);
            }

            const details = await response.json();
            setLists(prevLists =>
                prevLists.map(list =>
                    list.listName === listName
                        ? {
                            ...list,
                            details: {
                                ...list.details,
                                destinations: list.details.destinations.map(dest =>
                                    dest.id === destinationId
                                        ? { ...dest, fullDetails: details, expanded: !dest.expanded }
                                        : dest
                                ),
                            },
                        }
                        : list
                )
            );
        } catch (err) {
            console.error(`Error fetching details for destination ID "${destinationId}":`, err);
            setError("An error occurred while fetching destination details. Please try again.");
        }
    };

    const handleEdit = (listName) => {
        localStorage.setItem("listToEdit", listName); // Store list name in local storage
        navigate("/edit-list"); // Navigate to the EditListPage
    };

    useEffect(() => {
        fetchLists();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <NavigationBar />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Your Lists</h2>
                {loading ? (
                    <p>Loading your lists...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : lists.length > 0 ? (
                    lists.map((list, index) => (
                        <div key={index} style={styles.listContainer}>
                            <h3>{list.listName}</h3>
                            <button onClick={() => fetchListDetails(list.listName)}>
                                {list.expanded ? "Hide Details" : "Show Details"}
                            </button>
                            <button onClick={() => handleEdit(list.listName)}>Edit</button>
                            {list.expanded && list.details && (
                                <div>
                                    <p><strong>Description:</strong> {list.details.description}</p>
                                    <ul style={{ listStyleType: "none", padding: 0 }}>
                                        {list.details.destinations.map((destination, idx) => (
                                            <li key={idx} style={styles.listItem}>
                                                <strong>{destination.Destination}</strong> - {destination.Country}
                                                <button
                                                    onClick={() =>
                                                        fetchDestinationDetails(list.listName, destination.id)
                                                    }
                                                >
                                                    {destination.expanded ? "Hide Info" : "Show Info"}
                                                </button>
                                                {destination.expanded && destination.fullDetails && (
                                                    <div style={styles.destinationDetails}>
                                                        <p><strong>Region:</strong> {destination.fullDetails.Region || "No information available"}</p>
                                                        <p><strong>Category:</strong> {destination.fullDetails.Category || "No information available"}</p>
                                                        <p><strong>Latitude:</strong> {destination.fullDetails.Latitude || "No information available"}</p>
                                                        <p><strong>Longitude:</strong> {destination.fullDetails.Longitude || "No information available"}</p>
                                                        <p><strong>Tourists:</strong> {destination.fullDetails.ApproxAnnualTourists || "No information available"}</p>
                                                        <p><strong>Currency:</strong> {destination.fullDetails.Currency || "No information available"}</p>
                                                        <p><strong>Religion:</strong> {destination.fullDetails.MajorityReligion || "No information available"}</p>
                                                        <p><strong>Famous Foods:</strong> {destination.fullDetails.FamousFoods || "No information available"}</p>
                                                        <p><strong>Language:</strong> {destination.fullDetails.Language || "No information available"}</p>
                                                        <p><strong>Best Time to Visit:</strong> {destination.fullDetails.BestTimeToVisit || "No information available"}</p>
                                                        <p><strong>Cost of Living:</strong> {destination.fullDetails.CostOfLiving || "No information available"}</p>
                                                        <p><strong>Safety:</strong> {destination.fullDetails.Safety || "No information available"}</p>
                                                        <p><strong>Cultural Significance:</strong> {destination.fullDetails.CulturalSignificance || "No information available"}</p>
                                                        <p><strong>Description:</strong> {destination.fullDetails.Description || "No description available"}</p>
                                                    </div>
                                                )}
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
    destinationDetails: {
        marginTop: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f1f1f1",
    },
};
