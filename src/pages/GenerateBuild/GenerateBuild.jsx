import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import "./GenerateBuild.css";
import { validateBudget } from "../../utils/validateBudget";
import { useCases, presetBuilds } from "../../data/Presetbuilds";

export default function GenerateBuild() {

    const [result, setResult] = useState({ success: true, message: "" });
    const [customBudget, setCustomBudget] = useState("");
    const [activeCategory, setActiveCategory] = useState('gaming');
    const [expandedBuild, setExpandedBuild] = useState(null);

    const filteredPresets = useMemo(() => {
        return presetBuilds.filter(build => build.useCase === activeCategory);
    }, [activeCategory]);

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        const budget = +(customBudget);
        const r = validateBudget(budget);
        setResult(r);
        if (r?.success) {
            // run function to handle generating build
        }
    };

    const getTotalPrice = (parts) => {
        return Object.values(parts).reduce((sum, part) => sum + part.price, 0);
    };

    const partLabels = {
        cpu: 'CPU',
        gpu: 'GPU',
        motherboard: 'Motherboard',
        memory: 'Memory',
        storage: 'Storage',
        psu: 'Power Supply',
        case: 'Case',
        cooler: 'CPU Cooler',
    };

    return (
        <div className="generate-build-content">

            <div className="build-hero">
                <h1>Create a Build</h1>
                <p className="hero-subtitle">Choose a preset to get started instantly, or enter a custom budget below.</p>
                <form className="generate-build-form" onSubmit={handleCustomSubmit}>
                    <div className="inline">
                        <input
                            className="budget"
                            id="budget"
                            type="text"
                            placeholder="Enter your budget ($300 – $10,000)"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(e.target.value)}
                        />
                        <button type="submit" className="btn-primary">Generate</button>
                    </div>
                </form>
                {!result?.success &&
                    <p className="error-message">{result?.message}</p>
                }
                <Link to="/custom-build">
                    <button className="btn-custom-build">Create Your Own</button>
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
                            className={`category-tab ${activeCategory === uc.id ? 'active' : ''}`}
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
                    {useCases.find(u => u.id === activeCategory)?.description}
                </p>

                <div className="preset-grid">
                    {filteredPresets.map((build) => {
                        const total = getTotalPrice(build.parts);
                        const isExpanded = expandedBuild === build.id;
                        return (
                            <div
                                key={build.id}
                                className={`preset-card ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => setExpandedBuild(isExpanded ? null : build.id)}
                            >
                                <span className="tier-badge">{build.tier}</span>

                                <h4 className="preset-name">{build.name}</h4>
                                <p className="preset-desc">{build.description}</p>

                                <div className="preset-price-row">
                                    <span className="preset-price">${total.toLocaleString()}</span>
                                    <span className="preset-budget-target">~${build.budget.toLocaleString()} budget</span>
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
                                                <span className="part-category">{partLabels[key]}</span>
                                                <span className="part-name">{part.name}</span>
                                                <span className="part-price">
                                                    {part.price === 0 ? 'Included' : `$${part.price}`}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="preset-total-row">
                                            <span>Total</span>
                                            <span className="preset-total-price">${total.toLocaleString()}</span>
                                        </div>
                                        <button
                                            className="btn-use-build"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert(`Build "${build.name}" selected! (Integration coming soon)`);
                                            }}
                                        >
                                            Use This Build
                                        </button>
                                    </div>
                                )}

                                <span className="expand-indicator">
                                    {isExpanded ? '▲ Collapse' : '▼ View Parts'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}