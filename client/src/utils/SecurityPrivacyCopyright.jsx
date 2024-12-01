import React, { useState } from "react";
import { NavigationBar } from "./NavigationBar";

const SecurityPrivacyCopyright = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div>
            <NavigationBar />
            <div style={styles.container}>
                <h1>Policies and Contact Information</h1>

                {/* Security and Privacy Policy */}
                <div style={styles.section}>
                    <button
                        style={styles.toggleButton}
                        onClick={() => toggleSection("securityPrivacy")}
                    >
                        {expandedSection === "securityPrivacy"
                            ? "Hide Security and Privacy Policy"
                            : "Show Security and Privacy Policy"}
                    </button>
                    {expandedSection === "securityPrivacy" && (
                        <div style={styles.policyContent}>
                            <h2>Security and Privacy Policy</h2>
                            <p>
                                <strong>Overview:</strong> We are committed to safeguarding your
                                personal information and ensuring that our systems remain secure
                                against threats. This policy explains how we manage your data,
                                protect your privacy, and maintain the security of our platform.
                            </p>
                            <ul>
                                <li>
                                    <strong>Data Collection and Usage:</strong> Minimal information
                                    is collected to provide services, such as email and IP
                                    addresses. We do not sell or share data without your consent.
                                </li>
                                <li>
                                    <strong>Data Security:</strong> Encryption, secure storage, and
                                    regular audits ensure your data is safe.
                                </li>
                                <li>
                                    <strong>Privacy Commitment:</strong> We offer access to, and
                                    correction or deletion of, your data upon request.
                                </li>
                            </ul>
                            <p>
                                For more details, contact us at mattmurdock@daredevil.com.
                            </p>
                        </div>
                    )}
                </div>

                {/* Acceptable Use Policy */}
                <div style={styles.section}>
                    <button
                        style={styles.toggleButton}
                        onClick={() => toggleSection("acceptableUse")}
                    >
                        {expandedSection === "acceptableUse"
                            ? "Hide Acceptable Use Policy"
                            : "Show Acceptable Use Policy"}
                    </button>
                    {expandedSection === "acceptableUse" && (
                        <div style={styles.policyContent}>
                            <h2>Acceptable Use Policy</h2>
                            <p>
                                This policy ensures a safe, respectful, and productive environment
                                for all users.
                            </p>
                            <ul>
                                <li>
                                    <strong>Permitted Uses:</strong> Use the platform for lawful
                                    activities that align with its intended purpose.
                                </li>
                                <li>
                                    <strong>Prohibited Activities:</strong> Do not harass others,
                                    distribute malware, or access systems without authorization.
                                </li>
                                <li>
                                    <strong>Enforcement:</strong> Violations may result in warnings,
                                    account suspension, or legal action.
                                </li>
                            </ul>
                            <p>
                                If you notice violations, report them to mattmurdock@daredevil.com.
                            </p>
                        </div>
                    )}
                </div>

                {/* DMCA Notice and Takedown Policy */}
                <div style={styles.section}>
                    <button
                        style={styles.toggleButton}
                        onClick={() => toggleSection("dmca")}
                    >
                        {expandedSection === "dmca"
                            ? "Hide DMCA Notice and Takedown Policy"
                            : "Show DMCA Notice and Takedown Policy"}
                    </button>
                    {expandedSection === "dmca" && (
                        <div style={styles.policyContent}>
                            <h2>DMCA Notice and Takedown Policy</h2>
                            <p>
                                If you believe content on our platform infringes your copyright,
                                submit a notice with the following:
                            </p>
                            <ul>
                                <li>Your contact information (name, email, phone).</li>
                                <li>
                                    Description of the infringed work and location of the content.
                                </li>
                                <li>A good faith statement and your signature.</li>
                            </ul>
                            <p>
                                Send your notice to:
                                <br />
                                <strong>Email:</strong> mattmurdock@daredevil.com
                                <br />
                                <strong>Mail:</strong> 150 Western Rd, London, ON, Canada
                            </p>
                            <p>
                                Counter-notices can be submitted if you believe the content was
                                removed in error. Abuse of the DMCA process may result in account
                                suspension or legal action.
                            </p>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div style={styles.section}>
                    <button
                        style={styles.toggleButton}
                        onClick={() => toggleSection("contact")}
                    >
                        {expandedSection === "contact"
                            ? "Hide Contact Information"
                            : "Show Contact Information"}
                    </button>
                    {expandedSection === "contact" && (
                        <div style={styles.policyContent}>
                            <h2>Contact Information</h2>
                            <p>
                                <strong>Email:</strong> mattmurdock@daredevil.com
                                <br />
                                <strong>Phone:</strong> +1-800-124-9580
                                <br />
                                <strong>Mailing Address:</strong>
                                <br />
                                150 Western Road,
                                London, ON
                                CAN
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
    },
    section: {
        marginBottom: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    toggleButton: {
        width: "100%",
        padding: "15px",
        textAlign: "left",
        backgroundColor: "#ED2939",
        color: "#fff",
        border: "none",
        fontSize: "1.1rem",
        cursor: "pointer",
        outline: "none",
        transition: "background-color 0.3s ease",
    },
    policyContent: {
        padding: "15px",
        backgroundColor: "#f9f9f9",
        fontSize: "0.95rem",
        lineHeight: "1.6",
    },
};

export default SecurityPrivacyCopyright;
