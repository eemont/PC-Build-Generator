import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./GenerateBuild.css";
import { validateBudget } from "../../utils/validateBudget";
import { useCases, presetBuilds } from "../../data/Presetbuilds";
import { findParts, measurePartCompatibility } from "../../domain/partsApi";

// ─── Budget allocation for a balanced gaming PC ───────────────────────────────
// GPU:     35–50%  → 38%  (most impactful for gaming)
// CPU:     15–25%  → 20%
// Mobo:    10–15%  → 12%
// RAM:     10–15%  shared with storage  → 7.5% each
// Storage: 10–15%  shared with RAM      → 7.5%
// Case:    5–10%   → 6.5%
// PSU:     5–10%   → 6.5%
// Cooler:  remainder → 2%
// ─────────────────────────────────────────────────────────────────────────────
const BUDGET_ALLOCATION = {
    gpu:     0.50,   // aims for 50%, pickBestPart steps down from there
    cpu:     0.17,
    mobo:    0.10,
    memory:  0.065,
    storage: 0.065,
    case:    0.04,
    psu:     0.04,
    cooler:  0.02,
};

// CustomBuild slot key → partsApi partType
const SLOT_TO_PART_TYPE = {
    gpu:     "video-card",
    cpu:     "cpu",
    mobo:    "motherboard",
    memory:  "memory",
    storage: "internal-hard-drive",
    case:    "case",
    psu:     "power-supply",
    cooler:  "cpu-cooler",
};

/**
 * Pick the most expensive part that still fits within `budget`.
 * Zero-price parts are excluded to guard against DB/catalogue errors.
 * Falls back to the cheapest available part so no slot is left empty.
 */
function pickBestPart(parts, budget) {
    const valid = parts.filter((p) => p.part.price > 0);
    if (valid.length === 0) return null;

    const sorted = [...valid].sort((a, b) => b.price - a.price);
    const withinBudget = sorted.find((p) => p.price <= budget);
    return withinBudget ?? sorted[sorted.length - 1];
}

export default function GenerateBuild() {

    const [result, setResult] = useState({ success: true, message: "" });
    const [customBudget, setCustomBudget] = useState("");
    const [generating, setGenerating] = useState(false);
    const [activeCategory, setActiveCategory] = useState("gaming");
    const [expandedBuild, setExpandedBuild] = useState(null);

    const navigate = useNavigate();

    const filteredPresets = useMemo(() => {
        return presetBuilds.filter((build) => build.useCase === activeCategory);
    }, [activeCategory]);

    // ── Generate build from budget ────────────────────────────────────────────
    const handleGenerateBuild = async (budget) => {
        setGenerating(true);
        setResult({ success: true, message: "" });

        try {
            const selectedParts = {};

            for (const [slotKey, fraction] of Object.entries(BUDGET_ALLOCATION)) {
                const slotBudget = budget * fraction;
                const partType = SLOT_TO_PART_TYPE[slotKey];

                const fetchParts = async (ignoreCompatibility = false) => {
                    const parts = await findParts({
                        partType, 
                        limit: 100,
                        selectedParts,
                        ignoreCompatibility,
                        additionalFilters: [
                            { field: 'price', op: 'lte', val: slotBudget },
                            { field: 'price', op: 'order', val: true }
                        ]
                    });
                    return parts;
                }

                let parts = await fetchParts();
                if (parts.length == 0) {
                    parts = await fetchParts(true);
                }
                
                const best = pickBestPart(parts, slotBudget);

                if (best) {
                    selectedParts[slotKey] = best;
            
                    for (const [slotKey, selected] of Object.entries(selectedParts)) {
                        selectedParts[slotKey] = measurePartCompatibility(selected.part, selectedParts)
                    }
                }
            }

            const totalPrice = Object.values(selectedParts).reduce(
                (sum, p) => sum + (p.price ?? 0),
                0
            );

            navigate("/custom-build", {
                state: {
                    editBuild: {
                        id: null, // null → treated as a new build when saved
                        name: `$${budget.toLocaleString()} Build`,
                        parts: selectedParts,
                        totalPrice,
                        generatedBudget: budget,
                        dateSaved: new Date().toLocaleDateString(),
                    },
                },
            });
        } catch (err) {
            console.error("Failed to generate build:", err);
            setResult({
                success: false,
                message: "Failed to generate build. Please check your connection and try again.",
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        const budget = +customBudget;
        const r = validateBudget(budget);
        setResult(r);
        if (r?.success) {
            handleGenerateBuild(budget);
        }
    };

    // ── Preset helpers ────────────────────────────────────────────────────────
    const getTotalPrice = (parts) =>
        Object.values(parts).reduce((sum, part) => sum + part.price, 0);

    const partLabels = {
        cpu: "CPU",
        gpu: "GPU",
        motherboard: "Motherboard",
        memory: "Memory",
        storage: "Storage",
        psu: "Power Supply",
        case: "Case",
        cooler: "CPU Cooler",
    };

    return (
        <div className="generate-build-content">

            <div className="build-hero">
                <h1>Create a Build</h1>
                <p className="hero-subtitle">
                    Choose a preset to get started instantly, or enter a custom budget below.
                </p>
                <form className="generate-build-form" onSubmit={handleCustomSubmit}>
                    <div className="inline">
                        <input
                            className="budget"
                            id="budget"
                            type="text"
                            placeholder="Enter your budget ($300 – $10,000)"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(e.target.value)}
                            disabled={generating}
                        />
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={generating}
                        >
                            {generating ? "Generating…" : "Generate"}
                        </button>
                    </div>
                </form>

                {!result?.success && (
                    <p className="error-message">{result?.message}</p>
                )}

                <Link to="/custom-build">
                    <button className="btn-custom-build" disabled={generating}>
                        Create Your Own
                    </button>
                </Link>
            </div>

            <div className="section-divider">
                <span className="divider-line" />
                <span className="divider-text">or pick a preset</span>
                <span className="divider-line" />
            </div>

            <div className="preset-section">
                <div className="category-tabs">
                    {useCases.map((uc) => (
                        <button
                            key={uc.id}
                            className={`category-tab ${activeCategory === uc.id ? "active" : ""}`}
                            onClick={() => {
                                setActiveCategory(uc.id);
                                setExpandedBuild(null);
                            }}
                        >
                            <span className="tab-icon">{uc.icon}</span>
                            <span className="tab-label">{uc.label}</span>
                        </button>
                    ))}
                </div>

                <p className="category-desc">
                    {useCases.find((u) => u.id === activeCategory)?.description}
                </p>

                <div className="preset-grid">
                    {filteredPresets.map((build) => {
                        const total = getTotalPrice(build.parts);
                        const isExpanded = expandedBuild === build.id;
                        return (
                            <div
                                key={build.id}
                                className={`preset-card ${isExpanded ? "expanded" : ""}`}
                                onClick={() => setExpandedBuild(isExpanded ? null : build.id)}
                            >
                                <span className="tier-badge">{build.tier}</span>

                                <h4 className="preset-name">{build.name}</h4>
                                <p className="preset-desc">{build.description}</p>

                                <div className="preset-price-row">
                                    <span className="preset-price">${total.toLocaleString()}</span>
                                    <span className="preset-budget-target">
                                        ~${build.budget.toLocaleString()} budget
                                    </span>
                                </div>
                                <div className="preset-quick-specs">
                                    <span>{build.parts.cpu.name}</span>
                                    <span className="spec-dot">·</span>
                                    <span>{build.parts.gpu.name}</span>
                                </div>

                                {isExpanded && (
                                    <div className="preset-parts-list">
                                        {Object.entries(build.parts).map(([key, part]) => (
                                            <div key={key} className="preset-part-row">
                                                <span className="part-category">
                                                    {partLabels[key]}
                                                </span>
                                                <span className="part-name">{part.name}</span>
                                                <span className="part-price">
                                                    {part.price === 0 ? "Included" : `$${part.price}`}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="preset-total-row">
                                            <span>Total</span>
                                            <span className="preset-total-price">
                                                ${total.toLocaleString()}
                                            </span>
                                        </div>
                                        <button
                                            className="btn-use-build"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert(
                                                    `Build "${build.name}" selected! (Integration coming soon)`
                                                );
                                            }}
                                        >
                                            Use This Build
                                        </button>
                                    </div>
                                )}

                                <span className="expand-indicator">
                                    {isExpanded ? "▲ Collapse" : "▼ View Parts"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}