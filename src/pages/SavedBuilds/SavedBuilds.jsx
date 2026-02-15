import { useState } from "react";
import { Link } from "react-router-dom";
import "./SavedBuilds.css";

export default function SavedBuilds() {
    const [savedBuilds] = useState(() => {
        const saved = localStorage.getItem("savedBuilds");
        return saved ? JSON.parse(saved) : [];
    });

    const partLabels = {
        cpu: 'CPU',
        cooler: 'CPU Cooler',
        mobo: 'Motherboard',
        memory: 'Memory',
        storage: 'Storage',
        gpu: 'GPU',
        case: 'Case',
        psu: 'Power Supply',
    };

    return (
        <div className="saved-builds-page">
            <div className="saved-builds-header">
                <h1>Your Saved Builds</h1>
                <p className="saved-subtitle">Review and manage your custom configurations.</p>
            </div>

            {savedBuilds.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't saved any builds yet.</p>
                    <Link to="/custom-build">
                        <button className="btn-create-new">Create a Build</button>
                    </Link>
                </div>
            ) : (
                <div className="saved-grid">
                    {savedBuilds.map((build) => (
                        <div key={build.id} className="saved-card">
                            <div className="saved-card-header">
                                <h2 className="saved-build-name">{build.name}</h2>
                                <span className="saved-build-date">{build.dateSaved}</span>
                            </div>
                            
                            <div className="saved-build-price">${build.totalPrice.toFixed(2)}</div>
                            
                            <div className="saved-parts-list">
                                {Object.entries(build.parts).map(([slotKey, part]) => (
                                    <div key={slotKey} className="saved-part-row">
                                        <div className="saved-part-info">
                                            <span className="part-category">{partLabels[slotKey] || slotKey}</span>
                                            <span className="part-name">{part.brand} {part.model}</span>
                                        </div>
                                        <span className="part-price">${part.price?.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}