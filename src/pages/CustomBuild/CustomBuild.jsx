import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { findParts } from "../../utils/getParts";
import "./CustomBuild.css";

const COMPONENT_SLOTS = [
    { key: 'cpu',       label: 'CPU',          partKey: 'cpu'                 },
    { key: 'cooler',    label: 'CPU Cooler',    partKey: 'cpu-cooler'          },
    { key: 'mobo',      label: 'Motherboard',   partKey: 'motherboard'         },
    { key: 'memory',    label: 'Memory',        partKey: 'memory'              },
    { key: 'storage',   label: 'Storage',       partKey: 'internal-hard-drive' },
    { key: 'gpu',       label: 'GPU',           partKey: 'video-card'          },
    { key: 'case',      label: 'Case',          partKey: 'case'                },
    { key: 'psu',       label: 'Power Supply',  partKey: 'power-supply'        },
];

function formatPartSpecs(part, slotKey) {
    switch (slotKey) {
        case 'cpu':
            return [
                part.cores ? `${part.cores} cores` : null,
                part.tdp ? `${part.tdp}W TDP` : null,
                part.integratedGraphics || null,
            ].filter(Boolean).join(' · ');
        case 'cooler':
            return [
                part.radiatorSize ? `${part.radiatorSize}mm radiator` : 'Air cooler',
                part.noiseRange?.max ? `≤${part.noiseRange.max} dBA` : null,
            ].filter(Boolean).join(' · ');
        case 'mobo':
            return [
                part.socket || null,
                part.formFactor || null,
                part.ramSlots ? `${part.ramSlots} RAM slots` : null,
            ].filter(Boolean).join(' · ');
        case 'memory':
            return [
                part.memoryType?.toUpperCase() || null,
                part.capacityGB ? `${part.capacityGB}GB` : null,
            ].filter(Boolean).join(' · ');
        case 'storage':
            return [
                part.type?.toUpperCase() || null,
                part.capacity ? `${part.capacity >= 1000 ? (part.capacity / 1000) + 'TB' : part.capacity + 'GB'}` : null,
                part.connectionType || null,
            ].filter(Boolean).join(' · ');
        case 'gpu':
            return [
                part.chipset || null,
                part.vram ? `${part.vram}GB VRAM` : null,
                part.tdp ? `${part.tdp}W` : null,
            ].filter(Boolean).join(' · ');
        case 'case':
            return [
                part.type || null,
                part.internalBays ? `${part.internalBays} bays` : null,
            ].filter(Boolean).join(' · ');
        case 'psu':
            return [
                part.wattage ? `${part.wattage}W` : null,
                part.efficiencyRating || null,
                part.formfactor?.toUpperCase() || null,
            ].filter(Boolean).join(' · ');
        default:
            return '';
    }
}

export default function CustomBuild() {

    const [selectedParts, setSelectedParts] = useState({});
    const [pickerOpen, setPickerOpen] = useState(null);       // slot key or null
    const [availableParts, setAvailableParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buildName, setBuildName] = useState("");
    const navigate = useNavigate();

    // Fetch parts when picker opens
    const openPicker = useCallback(async (slot) => {
        setPickerOpen(slot.key);
        setLoading(true);
        setAvailableParts([]);

        try {
            const parts = await findParts(slot.partKey, 50, false);
            if (Array.isArray(parts)) {
                setAvailableParts(parts);
            }
        } catch (err) {
            console.error('Failed to load parts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const selectPart = (slotKey, part) => {
        setSelectedParts(prev => ({ ...prev, [slotKey]: part }));
        setPickerOpen(null);
    };

    const removePart = (slotKey) => {
        setSelectedParts(prev => {
            const copy = { ...prev };
            delete copy[slotKey];
            return copy;
        });
    };

    const totalPrice = Object.values(selectedParts).reduce((sum, part) => sum + (part.price || 0), 0);
    const partsCount = Object.keys(selectedParts).length;

    // Close picker on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setPickerOpen(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const handleSaveBuild = () => {
        if (!buildName.trim()) {
            alert("Please provide a name for your build.");
            return;
        }
        if (partsCount === 0) {
            alert("Please add at least one part before saving.");
            return;
        }

        const newBuild = {
            id: crypto.randomUUID(), // Generate a unique ID
            name: buildName,
            totalPrice: totalPrice,
            parts: selectedParts,
            dateSaved: new Date().toLocaleDateString()
        };

        // Get existing builds from local storage or start a new array
        const existingBuilds = JSON.parse(localStorage.getItem("savedBuilds") || "[]");
        
        // Add the new build and save back to local storage
        localStorage.setItem("savedBuilds", JSON.stringify([...existingBuilds, newBuild]));
        
        // Redirect to the Saved Builds page
        navigate("/saved");
    };
    
    return (
        <div className="custom-build-page">

            <div className="custom-build-header">
                <h1>Custom Build</h1>
                <p className="custom-subtitle">Pick each component to assemble your perfect PC.</p>
            </div>

            <div className="parts-table">
                <div className="parts-table-head">
                    <span className="col-component">Component</span>
                    <span className="col-selection">Selection</span>
                    <span className="col-price">Price</span>
                    <span className="col-actions"></span>
                </div>

                {COMPONENT_SLOTS.map((slot) => {
                    const part = selectedParts[slot.key];
                    const hasPart = !!part;
                    return (
                        <div key={slot.key} className={`part-row ${hasPart ? 'filled' : ''}`}>
                            <div className="col-component">
                                <span className="slot-icon"></span>
                                <span className="slot-label">{slot.label}</span>
                            </div>

                            <div className="col-selection">
                                {hasPart ? (
                                    <div className="selected-part-info">
                                        {part.img && (
                                            <img
                                                className="part-thumb"
                                                src={part.img || part.imageUrl}
                                                alt={part.model}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        )}
                                        <div className="part-details">
                                            <span className="part-brand-model">
                                                {part.brand} {part.model}
                                            </span>
                                            <span className="part-specs">
                                                {formatPartSpecs(part, slot.key)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="btn-pick"
                                        onClick={() => openPicker(slot)}
                                    >
                                        + Pick {slot.label}
                                    </button>
                                )}
                            </div>

                            <div className="col-price">
                                {hasPart && (
                                    <span className="part-price-value">${part.price?.toFixed(2)}</span>
                                )}
                            </div>

                            <div className="col-actions">
                                {hasPart ? (
                                    <div className="action-buttons">
                                        <button
                                            className="btn-change"
                                            onClick={() => openPicker(slot)}
                                            title="Change"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            className="btn-remove"
                                            onClick={() => removePart(slot.key)}
                                            title="Remove"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="totals-bar">
                <div className="totals-info">
                    <span className="totals-count">{partsCount} of {COMPONENT_SLOTS.length} parts selected</span>
                </div>
                <div className="totals-price">
                    <span className="totals-label">Estimated Total</span>
                    <span className="totals-value">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="save-build-section">
                <input
                    type="text"
                    className="build-name-input"
                    placeholder="Name your custom build..."
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                />
                <button className="btn-save-build" onClick={handleSaveBuild}>
                    Save Build
                </button>
            </div>

            {pickerOpen && (
                <div className="picker-overlay" onClick={() => setPickerOpen(null)}>
                    <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="picker-header">
                            <h2>
                                Choose {COMPONENT_SLOTS.find(s => s.key === pickerOpen)?.label}
                            </h2>
                            <button className="picker-close" onClick={() => setPickerOpen(null)}>✕</button>
                        </div>

                        <div className="picker-list">
                            {loading && (
                                <div className="picker-loading">
                                    <div className="spinner" />
                                    <span>Loading parts...</span>
                                </div>
                            )}

                            {!loading && availableParts.length === 0 && (
                                <div className="picker-empty">No parts found.</div>
                            )}

                            {!loading && availableParts.map((part, i) => {
                                const isSelected = selectedParts[pickerOpen]?.model === part.model
                                    && selectedParts[pickerOpen]?.brand === part.brand;
                                return (
                                    <div
                                        key={`${part.brand}-${part.model}-${i}`}
                                        className={`picker-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => selectPart(pickerOpen, part)}
                                    >
                                        <div className="picker-item-img">
                                            {(part.img || part.imageUrl) ? (
                                                <img
                                                    src={part.img || part.imageUrl}
                                                    alt={part.model}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            ) : (
                                                <div className="img-placeholder"></div>
                                            )}
                                        </div>
                                        <div className="picker-item-info">
                                            <span className="picker-item-name">
                                                {part.brand} {part.model}
                                            </span>
                                            <span className="picker-item-specs">
                                                {formatPartSpecs(part, pickerOpen)}
                                            </span>
                                        </div>
                                        <div className="picker-item-price">
                                            ${part.price?.toFixed(2)}
                                        </div>
                                        <button className="btn-add-part">
                                            {isSelected ? '✓ Selected' : 'Add'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}