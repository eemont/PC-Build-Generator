import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { findParts } from "../../domain/partsApi";
import { partMap } from "../../domain/partMap";
import { measurePartCompatibility } from "../../domain/partsApi";

import { COMPONENT_SLOTS } from "../../utils/componentSlots";
import PartIssue from "../../components/PartIssue/PartIssue";
import "./CustomBuild.css";

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
                part.formFactor?.toUpperCase() || null,
            ].filter(Boolean).join(' · ');
        default:
            return '';
    }
}

export default function CustomBuild() {
    const location = useLocation();
    const editBuild = location.state?.editBuild || null;

    const [selectedParts, setSelectedParts] = useState(() => {
        return editBuild 
            ? reinitializeParts(editBuild.parts) 
            : {}
    });    
    const [buildName, setBuildName] = useState(editBuild ? editBuild.name : "");
    const [buildNotes, setBuildNotes] = useState(editBuild ? (editBuild.notes || "") : "");
    const editId = editBuild ? editBuild.id : null;

    const [pickerOpen, setPickerOpen] = useState(null);
    const [availableParts, setAvailableParts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [ignoreCompatibility, setIgnoreCompatibility] = useState(false);
    
    const navigate = useNavigate();

    function reinitializeParts(parts) {
        const result = {};
        for (const [key, val] of Object.entries(parts)) {
            const foundIndex = COMPONENT_SLOTS.findIndex(slot => slot.key == key);
            const partKey = COMPONENT_SLOTS[foundIndex].partKey;
            const PartClass = partMap[partKey].class;

            const attrs = {...val.part}
            const partReformatted = new PartClass({attrs, ...val.part});

            result[key] = {
                ...val,
                part: partReformatted
            };
        }
        return result;
    }

    const fetchParts = async (slot, ignoreCompatibility) => {
        setLoading(true);
        setAvailableParts([]);
        try {
            const parts = await findParts({
                partType: slot.partKey, 
                selectedParts, 
                ignoreCompatibility,
                limit: 100
            });
            if (Array.isArray(parts)) {
                setAvailableParts(parts);
            }
        } catch (err) {
            console.error('Failed to load parts:', err);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch parts when changing compatibility preference
    const handleCheckboxChange = async () => {
        const newIgnoreCompatibility = !ignoreCompatibility;
        setIgnoreCompatibility(newIgnoreCompatibility);

        const slotIndex = COMPONENT_SLOTS.findIndex(slot => slot.key == pickerOpen);
        const slot = COMPONENT_SLOTS[slotIndex];
        await fetchParts(slot, newIgnoreCompatibility);
    };

    // Fetch parts when picker opens
    const openPicker = useCallback(async (slot) => {
        setPickerOpen(slot.key);
        await fetchParts(slot, ignoreCompatibility);        
    }, [selectedParts, ignoreCompatibility]);

    const selectPart = (slotKey, part) => {

        let newSelectedParts = {
            ...selectedParts,
            [slotKey]: { part }
        }

        // Refresh compatibility issues
        for (const [slotKey, selected] of Object.entries(newSelectedParts)) {
            newSelectedParts[slotKey] = measurePartCompatibility(selected.part, newSelectedParts)
        }

        setSelectedParts(newSelectedParts);
        setPickerOpen(null);
    };
    console.log(selectedParts);

    const removePart = (slotKey) => {
        setSelectedParts(prev => {
            const copy = { ...prev };
            delete copy[slotKey];
            return copy;
        });
    };

    const totalPrice = Object.values(selectedParts).reduce((sum, selected) => sum + (selected.part.price || 0), 0);
    const partsCount = Object.keys(selectedParts).length;

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
            id: editId || crypto.randomUUID(),
            name: buildName,
            notes: buildNotes.trim(),
            totalPrice: totalPrice,
            parts: selectedParts,
            dateSaved: new Date().toLocaleDateString()
        };

        const existingBuilds = JSON.parse(localStorage.getItem("savedBuilds") || "[]");

        let updatedBuilds;
        if (editId) {
            updatedBuilds = existingBuilds.map(b => b.id === editId ? newBuild : b);
        } else {
            updatedBuilds = [...existingBuilds, newBuild];
        }

        localStorage.setItem("savedBuilds", JSON.stringify(updatedBuilds));
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
                    <span className="col-selection">Compatible</span>
                    <span className="col-price">Price</span>
                    <span className="col-actions"></span>
                </div>

                {COMPONENT_SLOTS.map((slot) => {
                    const selected = selectedParts[slot.key]
                    const part = selectedParts[slot.key]?.part;
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

                            <div className="col-compatibility-msg">
                                {!selected.compatible &&
                                    <p>
                                        {
                                        selected.issues.filter(issue => issue.severity == 'error').length > 0
                                            ? <span>This part has severe compatibility errors</span>
                                            : <span>This part may not be compatible</span>
                                        }
                                    </p>
                                }
                            </div>

                            <div className="col-compatibility">
                                {!selected.compatible &&
                                    <span>
                                        <PartIssue
                                            issues={ selected.issues }
                                        ></PartIssue>
                                    </span>
                                    
                                }
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

            {/* ── Notes + Save ── */}
            <div className="build-notes-section">
                <label className="build-notes-label" htmlFor="build-notes">
                    Build Notes
                    <span className="build-notes-hint">Your reasoning, goals, or thoughts behind this build</span>
                </label>
                <textarea
                    id="build-notes"
                    className="build-notes-input"
                    placeholder="e.g. Prioritised single-core performance for gaming at 1440p. Went with air cooling to stay under budget — the Peerless Assassin handles the 7700X with headroom to spare. Chose B650 over X670 since I don't need PCIe 5.0 storage yet..."
                    value={buildNotes}
                    onChange={(e) => setBuildNotes(e.target.value)}
                    rows={4}
                />
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
                            <div className="left">
                                <h2>
                                    Choose {COMPONENT_SLOTS.find(s => s.key === pickerOpen)?.label}
                                </h2>

                                <label htmlFor="ignore-compatibility">Ignore Compatibility?</label>
                                <input 
                                    name="ignore-compatibility" 
                                    type="checkbox" 
                                    onChange={handleCheckboxChange} 
                                    checked = {ignoreCompatibility}
                                />
                            </div>

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

                            {!loading && availableParts.map((available, i) => {
                                const isSelected = selectedParts[pickerOpen]?.part?.id === available.part.id
                                return (
                                    <div
                                        key={`${available.part.brand}-${available.part.model}-${i}`}
                                        className={`picker-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => selectPart(pickerOpen, available.part)}
                                    >
                                        <div className="picker-item-img">
                                            {(available.part.img || available.part.imageUrl) ? (
                                                <img
                                                    src={available.part.img || available.part.imageUrl}
                                                    alt={available.part.model}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            ) : (
                                                <div className="img-placeholder"></div>
                                            )}
                                        </div>
                                        <div className="picker-item-info">
                                            <span className="picker-item-name">
                                                {available.part.brand} {available.part.model}
                                            </span>
                                            <span className="picker-item-specs">
                                                {formatPartSpecs(available.part, pickerOpen)}
                                            </span>
                                        </div>
                                        <div className="picker-item-compatibility">
                                            { !available.compatible &&
                                                <PartIssue
                                                    issues={available.issues}
                                                />
                                            }
                                        </div>
                                        <div className="picker-item-price">
                                            ${available.part?.price?.toFixed(2)}
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