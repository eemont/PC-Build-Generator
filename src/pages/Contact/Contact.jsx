import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./Contact.css";

export default function Contact() {
    // 1. Set up state for our form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    // 2. Set up state for UI feedback
    const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState("");

    // 3. Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // 4. Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        // Basic validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setErrorMessage("Please fill out all fields.");
            setStatus("error");
            return;
        }

        // Send to Supabase
        const { error } = await supabase
            .from('contact_messages')
            .insert([
                { 
                    name: formData.name, 
                    email: formData.email, 
                    subject: formData.subject, 
                    message: formData.message 
                }
            ]);

        if (error) {
            console.error("Error submitting contact form:", error);
            setErrorMessage("Something went wrong. Please try again later.");
            setStatus("error");
        } else {
            setStatus("success");
            // Clear the form
            setFormData({ name: "", email: "", subject: "", message: "" });
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <h1>Contact Us</h1>
                <p>Have an issue or a question? Reach out to us below.</p>
                
                <div className="report-problem">
                    <h2>Report a Problem</h2>
                    
                    {/* Success Message */}
                    {status === "success" ? (
                        <div className="success-message" style={{ color: "#A055FF", textAlign: "center", padding: "20px 0" }}>
                            <h3>Thank you!</h3>
                            <p>Your message has been sent successfully. We will get back to you soon.</p>
                            <button 
                                className="submit-btn" 
                                onClick={() => setStatus("idle")}
                                style={{ marginTop: "15px" }}
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            {/* Error Message */}
                            {status === "error" && (
                                <div style={{ color: "#ff5555", marginBottom: "10px", fontSize: "0.95rem" }}>
                                    {errorMessage}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    placeholder="Your Name" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={status === "loading"}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="Your Email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={status === "loading"}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    placeholder="Issue Subject" 
                                    value={formData.subject}
                                    onChange={handleChange}
                                    disabled={status === "loading"}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea 
                                    id="message" 
                                    rows="5" 
                                    placeholder="Describe the problem you encountered..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={status === "loading"}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={status === "loading"}
                                style={{ opacity: status === "loading" ? 0.7 : 1 }}
                            >
                                {status === "loading" ? "Sending..." : "Submit Report"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="contact-info">
                    <h2>Developer Contact</h2>
                    <p><strong>Email:</strong> placeholder@example.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Some Lane, Some City, CA 00000</p>
                </div>
            </div>
        </div>
    );
}