import "./Contact.css";

export default function Contact() {
    return (
        <div className="contact-page">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p className="contact-subtitle">Found a bug or have a suggestion? Let us know!</p>
            </div>

            <div className="contact-content">
                <div className="report-problem-section">
                    <h2>Report a Problem</h2>
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" className="contact-input" placeholder="Your Name" />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" className="contact-input" placeholder="Your Email Address" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" className="contact-input" placeholder="What is the issue?" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message" 
                                className="contact-input contact-textarea" 
                                rows="5" 
                                placeholder="Please describe the problem in detail..."
                            ></textarea>
                        </div>
                        
                        <button type="submit" className="btn-submit-contact">
                            Send Message
                        </button>
                    </form>
                </div>

                <div className="contact-info-section">
                    <h2>Company Contact</h2>
                    <div className="info-card">
                        <p><strong>Name:</strong> Insert Company Name</p>
                        <p><strong>Email:</strong> company@example.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}