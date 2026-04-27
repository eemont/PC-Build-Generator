import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/useAuth";
import { Navigate } from "react-router-dom";

export default function Triage() {
    const { session } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const ADMIN_EMAILS = ["dylantran341@gmail.com"];

    if (session && !ADMIN_EMAILS.includes(session.user.email)) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        async function fetchPendingMessages() {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching messages:", error);
            } else {
                setMessages(data);
            }
            setLoading(false);
        }

        fetchPendingMessages();
    }, []);

    if (loading) return <div style={{ padding: 24, color: 'white' }}>Loading Triage Dashboard...</div>;

    return (
        <div style={{ padding: '100px 24px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Admin Triage Dashboard</h1>
            {messages.length === 0 ? (
                <p>No pending messages to review!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '12px', border: '1px solid rgb(50,50,50)' }}>
                            <h3>{msg.subject}</h3>
                            <p><strong>From:</strong> {msg.name} ({msg.email})</p>
                            <p><strong>Category:</strong> {msg.category}</p>
                            <p style={{ marginTop: '10px' }}>{msg.message}</p>
                            {/* more to be added */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}