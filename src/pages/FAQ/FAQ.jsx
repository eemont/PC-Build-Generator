import { Link } from "react-router-dom"
import "./FAQ.css"

const faqs = [
    {
        question: "Is this tool free to use?",
        answer:
            "Yes! PC Build Generator is completely free. Create an account to save and manage your builds, or use the generator as a guest with no strings attached.",
    },
    {
        question: "How does the build generator work?",
        answer:
            "You enter a budget. Our system then recommends a fully compatible set of components optimized for performance at your price point.",
    },
    {
        question: "Are the recommended parts compatible with each other?",
        answer:
            "Absolutely. Every generated build goes through compatibility checks — socket types, RAM speeds, power requirements, and more — so you won't end up with parts that don't work together.",
    },
    {
        question: "Can I customize a generated build?",
        answer:
            "Yes. After generating a build you can swap out individual components via the Custom Build page. Any part can be replaced while keeping the rest of your selections intact.",
    },
    {
        question: "Where can I buy the recommended parts?",
        answer:
            "Each component links out to popular retailers. We don't sell parts directly, but we surface real-time pricing so you can shop wherever you prefer.",
    },
    {
        question: "Can I share my build with friends?",
        answer:
            "Once you save a build to your account, you'll get a shareable link you can send to anyone — no account needed to view a shared build.",
    },
    {
        question: "What if I have a question that isn't answered here?",
        answer:
            "Feel free to reach out through our GitHub repo. We try to respond within a couple of business days.",
    },
]

export default function FAQ() {
    return (
        <div className="faq-page">
            <div className="faq-header">
                <Link to="/" className="faq-back">← Back to Home</Link>
                <h1>Frequently Asked Questions</h1>
                <p className="faq-subtitle">Everything you need to know about PC Build Generator.</p>
            </div>

            <div className="faq-list">
                {faqs.map((item, i) => (
                    <details key={i} className="faq-item">
                        <summary className="faq-question">{item.question}</summary>
                        <p className="faq-answer">{item.answer}</p>
                    </details>
                ))}
            </div>

            <div className="faq-footer">
                <p>Still have questions?</p>
                <Link to="/build">
                    <button>Try the Builder</button>
                </Link>
            </div>
        </div>
    )
}