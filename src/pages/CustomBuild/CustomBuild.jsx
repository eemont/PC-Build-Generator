import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { findParts } from "../../domain/partsApi";
import { partMap } from "../../domain/partMap";
import { measurePartCompatibility } from "../../domain/partsApi";
import { AuthContext } from "../../context/AuthContext";
import { saveBuild } from "../../lib/buildsApi";

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
    
    const [ compatPercent, setCompatPercent ] = useState(0);

    // Calculate compatibility percentage: parts w/out errors (can have warnings) / total
    useEffect(() => {
        const compatibleParts = Object.values(selectedParts).filter(part =>
            part.compatible || part.issues.filter(issue => issue.severity == "error").length == 0
        );
        const totalParts = Object.values(selectedParts).length;
        const compatibilityPercentage = Number.isNaN(compatibleParts.length / totalParts)
                ? 0
                : compatibleParts.length / totalParts;
        setCompatPercent(compatibilityPercentage);
        
        const compatibilityWheel = document.querySelector(".compatibility-wheel");
        if (compatibilityWheel) {
            compatibilityWheel.style.setProperty("--angle", `${compatibilityPercentage*360}deg`);
        }
    }, [selectedParts]);

    const [buildName, setBuildName] = useState(editBuild ? editBuild.name : "");
    const [buildNotes, setBuildNotes] = useState(editBuild ? (editBuild.notes || "") : "");
    const editId = editBuild ? editBuild.id : null;
    const generatedBudget = editBuild?.generatedBudget ?? null;

    const { session } = useContext(AuthContext) || {};

    const [pickerOpen, setPickerOpen] = useState(null);
    const [availableParts, setAvailableParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [ignoreCompatibility, setIgnoreCompatibility] = useState(false);
    
    const navigate = useNavigate();

    function generateCompatiblity(parts = null) {
        const _selectedParts = parts ?? selectedParts;
        for (const [slotKey, selected] of Object.entries(_selectedParts)) {
            _selectedParts[slotKey] = measurePartCompatibility(selected.part, _selectedParts);
        }
        return _selectedParts;
    }

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
        const withCompatibility = generateCompatiblity(result);
        return withCompatibility;
    }

    const fetchParts = useCallback(async (slot, ignoreCompatibility) => {
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
    }, [selectedParts]);

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
    }, [ignoreCompatibility, fetchParts]);

    const selectPart = (slotKey, part) => {

        let newSelectedParts = {...selectedParts}
        if (part != null) {
            newSelectedParts[slotKey] = { part }
        } else {
            delete newSelectedParts[slotKey];
        }
        newSelectedParts = generateCompatiblity(newSelectedParts);

        setSelectedParts(newSelectedParts);
        setPickerOpen(null);
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

    const handleSaveBuild = async () => {
        if (!buildName.trim()) {
            alert("Please provide a name for your build.");
            return;
        }
        if (partsCount === 0) {
            alert("Please add at least one part before saving.");
            return;
        }
        if (!session?.user) {
            alert("You must be logged in to save a build.");
            return;
        }

        setSaving(true);
        try {
            await saveBuild({
                buildId: editId,
                userId: session.user.id,
                name: buildName,
                notes: buildNotes.trim(),
                totalPrice,
                generatedBudget,
                selectedParts,
            });
            navigate("/saved");
        } catch (err) {
            console.error("Failed to save build:", err);
            alert("Failed to save build. Please try again.");
        } finally {
            setSaving(false);
        }
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
                                {selected && !selected?.compatible &&
                                    <p>
                                        {
                                        selected?.issues?.filter(issue => issue.severity === 'error')?.length > 0
                                            ? <span>Severe compatibility errors</span>
                                            : <span>May not be compatible</span>
                                        }
                                    </p>
                                }
                            </div>

                            <div className="col-compatibility">
                                <span>
                                    <PartIssue
                                        issues={ selected?.issues || [] }
                                    ></PartIssue>
                                </span>
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
                                            onClick={() => selectPart(slot.key, null)}
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

                {generatedBudget && (
                    <div className="budget-usage">
                        <div className="budget-usage-labels">
                            <span className="budget-usage-text">Budget Used</span>
                            <span className="budget-usage-fraction">
                                ${totalPrice.toFixed(2)}
                                <span className="budget-usage-of"> / ${generatedBudget.toLocaleString()}</span>
                            </span>
                        </div>
                        <div className="budget-bar-track">
                            <div
                                className="budget-bar-fill"
                                style={{
                                    width: `${Math.min((totalPrice / generatedBudget) * 100, 100)}%`,
                                    background: totalPrice > generatedBudget
                                        ? '#ff5555'
                                        : totalPrice / generatedBudget > 0.9
                                        ? '#f0a500'
                                        : 'var(--primary-purple)',
                                }}
                            />
                        </div>
                        <span className="budget-usage-pct">
                            {Math.round((totalPrice / generatedBudget) * 100)}% used
                        </span>
                    </div>
                )}

                {/* Compatibility Wheel */}
                <div className="compatibility-wheel-wrapper">
                    <div className="compatibility-wheel"></div>
                    <div className="compatibility-text">
                        <p className="compatibility-percentage">{(compatPercent*100).toFixed(2)}%</p>
                        <p>compatible</p>
                    </div>
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
                <p className="save-build-warning">
                    { Object.values(selectedParts).filter(selected => selected.issues?.length > 0).length > 0 &&
                        '*WARNING: Not all parts in this build may be compatible'
                    }
                </p>

                <div className="save-build-input">
                    <input
                        type="text"
                        className="build-name-input"
                        placeholder="Name your custom build..."
                        value={buildName}
                        onChange={(e) => setBuildName(e.target.value)}
                    />
                    <button className="btn-save-build" onClick={handleSaveBuild} disabled={saving}>
                        {saving ? "Saving..." : "Save Build"}
                    </button>
                </div>
            </div>

            {pickerOpen && (
                <div className="picker-overlay" onClick={() => setPickerOpen(null)}>
                    <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="picker-header">
                            <div className="left">
                                <h2>
                                    Choose {COMPONENT_SLOTS.find(s => s.key === pickerOpen)?.label}
                                </h2>

                                <div className="separator"></div>

                                <div className="ignore-compatibility-box">
                                    <input
                                        name="ignore-compatibility"
                                        id="ignore-compatibility"
                                        type="checkbox"
                                        onChange={handleCheckboxChange}
                                        checked = {ignoreCompatibility}
                                    />
                                    <label htmlFor="ignore-compatibility">Ignore Compatibility</label>
                                </div>
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
                                            <PartIssue
                                                issues={available?.issues}
                                            />
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