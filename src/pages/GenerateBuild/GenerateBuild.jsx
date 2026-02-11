import { useState, useEffect } from "react";

import "./GenerateBuild.css";
import { validateBudget } from "../../utils/validateBudget";

export default function GenerateBuild() {

    const [ result, setResult ] = useState({
        success: true,
        message: ""
    });

    useEffect(() => {        
        const form = document.querySelector('.generate-build-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const budget = +(e.target.budget.value);
            const r = validateBudget(budget);
            setResult(r);

            if (r?.success) {
                // run function to handle generating build
            }
        });
    }, []);

    return (
        <div className="generate-build-content">
            <h1>Create a Build</h1>
            <p>Enter your budget to see an interactive breakdown of your PC.</p>
            <form action="" className="generate-build-form">
                <div className="inline">
                    <input className="budget" id="budget" type="text" placeholder="Enter your budget ($300 - $10,000)." />
                    <button type="submit">Submit</button>
                </div>
            </form>
            { !result?.success && 
                <p className="error-message ">
                    { result?.message }
                </p>
            }
        </div>
    )
}