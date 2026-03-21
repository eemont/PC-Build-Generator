import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import PartIssue from "../../components/PartIssue/PartIssue";
import "./SavedBuilds.css";

export default function SavedBuilds() {
    const [savedBuilds, setSavedBuilds] = useState(() => {
        const saved = localStorage.getItem("savedBuilds");
        return saved ? JSON.parse(saved) : [];
    });
    const [viewingBuild, setViewingBuild] = useState(null);

    console.log(savedBuilds);

    const navigate = useNavigate();

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") setViewingBuild(null);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this build?")) {
            const updatedBuilds = savedBuilds.filter(build => build.id !== id);
            setSavedBuilds(updatedBuilds);
            localStorage.setItem("savedBuilds", JSON.stringify(updatedBuilds));
        }
    };

    const handleEdit = (build) => {
        navigate("/custom-build", { state: { editBuild: build } });
    };

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

    const getTotalPrice = (parts) =>
        Object.values(parts).reduce((sum, p) => sum + (p.price || 0), 0);

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
                                {Object.entries(build.parts).map(([slotKey, selected]) => (
                                    <div key={slotKey} className="saved-part-row">
                                        <div className="saved-part-info">
                                            <span className="part-category">{partLabels[slotKey] || slotKey}</span>
                                            <span className="part-name">{selected.part.brand} {selected.part.model}</span>
                                        </div>
                                        <span className="part-price">${selected.part.price?.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="saved-card-actions">
                                <button className="btn-view" onClick={() => setViewingBuild(build)}>View</button>
                                <button className="btn-edit" onClick={() => handleEdit(build)}>Edit</button>
                                <button className="btn-delete" onClick={() => handleDelete(build.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── View Build Modal ── */}
            {viewingBuild && (
                <div className="view-overlay" onClick={() => setViewingBuild(null)}>
                    <div className="view-modal" onClick={(e) => e.stopPropagation()}>

                        <div className="view-modal-header">
                            <div className="view-modal-title">
                                <h2>{viewingBuild.name}</h2>
                                <span className="view-modal-date">Saved on {viewingBuild.dateSaved}</span>
                            </div>
                            <button className="view-modal-close" onClick={() => setViewingBuild(null)}>✕</button>
                        </div>

                        <div className="view-modal-body">

                            {/* Build notes — only rendered if the user wrote something */}
                            {viewingBuild.notes && (
                                <div className="view-notes-block">
                                    <span className="view-notes-label">Build Notes</span>
                                    <p className="view-notes-text">{viewingBuild.notes}</p>
                                </div>
                            )}

                            <div className="view-parts-table">
                                <div className="view-parts-head">
                                    <span>Component</span>
                                    <span>Part</span>
                                    <span>Compatible</span>
                                    <span>Price</span>
                                </div>

                                {Object.entries(viewingBuild.parts).map(([slotKey, selected]) => (
                                    <div key={slotKey} className="view-part-row">
                                        <span className="view-part-category">
                                            {partLabels[slotKey] || slotKey}
                                        </span>
                                        <div className="view-part-info">
                                            {selected.part.img && (
                                                <img
                                                    className="view-part-thumb"
                                                    src={selected.part.img}
                                                    alt={selected.part.model}
                                                    onError={(e) => e.target.style.display = "none"}
                                                />
                                            )}
                                            <span className="view-part-name">
                                                {selected.part.brand} {selected.part.model}
                                            </span>
                                        </div>
                                        <span className="view-part-compatibility">
                                            <PartIssue 
                                                issues={selected.issues}
                                            />
                                        </span>
                                        <span className="view-part-price">
                                            ${selected.part.price?.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="view-modal-footer">
                            <span className="view-parts-count">
                                {Object.keys(viewingBuild.parts).length} parts
                            </span>
                            <div className="view-total">
                                <span className="view-total-label">Total</span>
                                <span className="view-total-price">
                                    ${getTotalPrice(viewingBuild.parts).toFixed(2)}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}