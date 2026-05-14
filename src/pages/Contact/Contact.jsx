import "./Contact.css";

export default function Contact() {
    return (
        <div className="contact-page">
            <div className="contact-container">
                <h1>Contact Us</h1>
                <p>Get in touch with our development team.</p>

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