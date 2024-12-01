import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJWTToken, getCurrentDayAndTime } from "./AuthorizedFunctionality";
import { NavigationBar } from "./NavigationBar";
import { useLocation } from "react-router-dom";

const EditListPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const isGuest = state?.isGuest || false;
    const userEmail = localStorage.getItem("userEmail");

    const originalListName = localStorage.getItem("listToEdit"); // Original list name
    const [listDetails, setListDetails] = useState({
        listName: originalListName || "", // Default to an empty string if originalListName is not available
        description: "",
        visibility: "private",
        destinations: [],
        dateEdited: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListDetails = async () => {
            try {
                const response = await fetch(`/api/secure/lists/getinfo/${originalListName}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${getJWTToken()}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch list details: ${response.statusText}`);
                }

                const details = await response.json();
                setListDetails({
                    listName: details.listName || "",
                    description: details.listDescription || "",
                    visibility: details.listVisibility || "private",
                    destinations: details.destinations || [],
                    dateEdited: details.dateEdited || "",
                });
            } catch (err) {
                console.error("Error fetching list details:", err);
                setError("An error occurred while fetching the list details.");
            } finally {
                setLoading(false);
            }
        };

        fetchListDetails();
    }, [originalListName]);

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/secure/lists/editlist/${originalListName}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getJWTToken()}`,
                },
                body: JSON.stringify({
                    newListName: listDetails.listName,
                    listDescription: listDetails.description,
                    listVisibility: listDetails.visibility,
                    destinationNames: listDetails.destinations.map((dest) => dest.Destination),
                    lastEditedDateTime: getCurrentDayAndTime(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to save changes: ${response.statusText}`);
            }

            alert("List updated successfully!");
            navigate("/my-lists", { state: { isGuest: isGuest, user: userEmail } });
        } catch (err) {
            console.error("Error saving list:", err);
            setError("An error occurred while saving the list. Please try again.");
        }
    };

    if (loading) {
        return <p style={styles.loading}>Loading...</p>;
    }

    if (error) {
        return <p style={styles.error}>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <NavigationBar />
            <h2 style={styles.heading}>Edit List</h2>
            <div style={styles.field}>
                <label style={styles.label}>
                    List Name:
                    <input
                        type="text"
                        value={listDetails.listName}
                        onChange={(e) =>
                            setListDetails((prev) => ({ ...prev, listName: e.target.value }))
                        }
                        style={styles.input}
                    />
                </label>
            </div>
            <div style={styles.field}>
                <label style={styles.label}>
                    Description:
                    <input
                        type="text"
                        value={listDetails.description}
                        onChange={(e) =>
                            setListDetails((prev) => ({ ...prev, description: e.target.value }))
                        }
                        style={styles.input}
                    />
                </label>
            </div>
            <div style={styles.field}>
                <label style={styles.label}>
                    Visibility:
                    <select
                        value={listDetails.visibility}
                        onChange={(e) =>
                            setListDetails((prev) => ({ ...prev, visibility: e.target.value }))
                        }
                        style={styles.select}
                    >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </label>
            </div>
            <div style={styles.field}>
                <label style={styles.label}>
                    Destinations:
                    <input
                        type="text"
                        value={listDetails.destinations.map((dest) => dest.Destination).join(",")}
                        onChange={(e) =>
                            setListDetails((prev) => ({
                                ...prev,
                                destinations: e.target.value.split(",").map((name) => ({ Destination: name.trim() })),
                            }))
                        }
                        style={styles.input}
                    />
                </label>
            </div>
            <div style={styles.buttonContainer}>
                <button onClick={handleSave} style={styles.button}>
                    Save Changes
                </button>
                <button
                    onClick={() =>
                        navigate("/my-lists", { state: { isGuest: isGuest, user: userEmail } })
                    }
                    style={styles.cancelButton}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditListPage;

const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
    },
    heading: {
        marginBottom: "20px",
        color: "#007BFF",
    },
    field: {
        marginBottom: "20px",
        textAlign: "left",
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontWeight: "bold",
        fontSize: "1rem",
        color: "#333",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
    },
    select: {
        width: "100%",
        padding: "10px",
        fontSize: "1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
    },
    buttonContainer: {
        marginTop: "20px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#ED2939",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        marginRight: "10px",
        transition: "background-color 0.3s ease",
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#ED2939",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    error: {
        color: "red",
        fontSize: "1rem",
    },
    loading: {
        color: "#007BFF",
        fontSize: "1rem",
    },
};
