import { useState } from "react";
import { COMPONENT_SLOTS } from "../../utils/componentSlots";

import errorImage from "/assets/error.webp";
import warningImage from "/assets/warning.webp";
import "./PartIssue.css";

export default function PartIssue({ issues }) {
    const [ showTooltip, setShowTooltip ] = useState(false);

    const hasError = issues.filter(issue => issue.severity == 'error').length > 0;

    function handleTooltip() {
        // cursor tracking
    }

    if (issues.length > 0) {
        return (
            <div className="issue-container">
                <div 
                    className="issue-image"
                    onMouseMove={handleTooltip}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {
                    hasError
                        ? <img src={errorImage} alt="Error Image"></img>
                        : <img src={warningImage} alt="Warning Image"></img>
                    }
                </div>


                { showTooltip &&
                    <div className="issue-tooltip">
                        {
                        <ul className="issues">
                            { 
                            issues.map((issue, i) => {
                                const found = COMPONENT_SLOTS.findIndex(slot => slot.key == issue.sourceSlot);
                                const slot = COMPONENT_SLOTS[found];
                                console.log(issue.val)
                                return (
                                    <li key={i}>
                                        {issue.severity == 'error'
                                            ? <b>Error - </b>
                                            : <b>Warning - </b>
                                        }
                                        { slot?.label }: {issue.message}
                                        { issue.message.indexOf(issue.val) == -1 &&
                                            <i> (
                                                {issue.val
                                                    ? `Unknown value: ${issue.val}`
                                                    : 'Value is empty'
                                                }
                                            ) </i>
                                        }
                                    </li>
                                )
                            })
                            }
                        </ul>
                        }
                    </div>
                }
            </div>
        )
    }
}