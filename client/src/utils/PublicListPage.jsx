import React, { useState, useEffect } from "react";
import { NavigationBar } from "./NavigationBar";
import { getJWTToken } from "./AuthorizedFunctionality";

const PublicListPage = () => {
    const [lists, setLists] = useState([]); // Store public list names
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPublicLists = async () => {
        try {
            // Fetch all public list names
            const response = await fetch(`/api/secure/lists/getpubliclists`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getJWTToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch public lists: ${response.statusText}`);
            }

            const listNames = await response.json();
            setLists(
                listNames.map((listName) => ({
                    listName,
                    expanded: false,
                    details: null,
                }))
            );
        } catch (err) {
            console.error("Error fetching public lists:", err);
            setError("An error occurred while fetching public lists. Please try again.");
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
            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.listName === listName
                        ? {
                              ...list,
                              details: {
                                  description: details.listDescription,
                                  visibility: details.listVisibility,
                                  destinations: details.destinations.map((dest) => ({
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

    const fetchDestinationDetails = async (destinationId, listName) => {
        try {
            const response = await fetch(`/api/open/destinations/${destinationId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch details for destination ID: ${destinationId}`);
            }

            const fullDetails = await response.json();
            setLists((prevLists) =>
                prevLists.map((list) =>
                    list.listName === listName
                        ? {
                              ...list,
                              details: {
                                  ...list.details,
                                  destinations: list.details.destinations.map((dest) =>
                                      dest.id === destinationId
                                          ? { ...dest, fullDetails, expanded: !dest.expanded }
                                          : dest
                                  ),
                              },
                          }
                        : list
                )
            );
        } catch (err) {
            console.error(`Error fetching destination details:`, err);
            setError("An error occurred while fetching destination details.");
        }
    };

    useEffect(() => {
        fetchPublicLists();
    }, []);

    return (
        <div>
            <NavigationBar />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h2>Public Lists</h2>
                {loading ? (
                    <p>Loading public lists...</p>
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
                                    <p>
                                        <strong>Description:</strong> {list.details.description || "No description available"}
                                    </p>
                                    <ul style={{ listStyleType: "none", padding: 0 }}>
                                        {list.details.destinations.map((destination, idx) => (
                                            <li key={idx} style={styles.listItem}>
                                                <strong>{destination.Destination}</strong> - {destination.Country}
                                                <button
                                                    onClick={() =>
                                                        fetchDestinationDetails(destination.id, list.listName)
                                                    }
                                                    style={{ marginLeft: "10px" }}
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
                    <p>No public lists available.</p>
                )}
            </div>
        </div>
    );
};

export default PublicListPage;

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
        backgroundColor: "#f1f1f1",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
};
