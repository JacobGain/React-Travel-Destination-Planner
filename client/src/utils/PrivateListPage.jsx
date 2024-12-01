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
                                reviews: details.reviews || [], // Handle missing or empty reviews
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
                            <button onClick={() => fetchListDetails(list.listName)} style={styles.button}>
                                {list.expanded ? "Hide Details" : "Show Details"}
                            </button>
                            <br></br>
                            <button onClick={() => handleEdit(list.listName)} style={styles.button}>Edit</button>
                            {list.expanded && list.details && (
                                <div>
                                    <p><strong>Description:</strong> {list.details.description}</p>
                                    <ul style={{ listStyleType: "none", padding: 0 }}>
                                        {list.details.destinations.map((destination, idx) => (
                                            <li key={idx} style={styles.listItem}>
                                                <strong>{destination.Destination}</strong> - {destination.Country} <br></br>
                                                <button
                                                    onClick={() =>
                                                        fetchDestinationDetails(list.listName, destination.id)
                                                    }
                                                    style={styles.button}
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
                                    {/* Display reviews */}
                                    <div>
                                        <h4>Reviews</h4>
                                        {list.details.reviews.length > 0 ? (
                                            list.details.reviews.map((review, idx) => (
                                                <div key={idx} style={styles.review}>
                                                    <p><strong>By: {review.userEmail}</strong></p>
                                                    <p>Rating: {review.rating}</p>
                                                    <p>{review.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No reviews available for this list.</p>
                                        )}
                                    </div>
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
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        margin: "15px 0",
        backgroundColor: "#f9f9f9",
        textAlign: "left", // Align content to the left
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    listItem: {
        margin: "10px 0",
        padding: "10px",
        borderBottom: "1px solid #ddd",
        fontSize: "1rem",
        lineHeight: "1.5",
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
    review: {
        marginTop: "15px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        fontSize: "0.95rem",
        lineHeight: "1.6",
    },
    button: {
        padding: "10px 20px",
        margin: "10px 0",
        backgroundColor: "#ED2939",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "0.95rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    buttonHover: {
        backgroundColor: "#7C0A02",
    },
    heading: {
        fontSize: "1.25rem",
        marginBottom: "10px",
        color: "#333",
    },
    description: {
        fontSize: "1rem",
        marginBottom: "10px",
        color: "#666",
    },
};
