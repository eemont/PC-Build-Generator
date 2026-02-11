

export function validateBudget(budget) {

    const min = 300;
    const max = 10000;

    // Check budget formatting
    if (typeof budget != "number" || Number.isNaN(budget)) {
        return {
            success: false,
            message: "Invalid budget format"
        }
    }
    
    // Check budget range
    if (budget > max || budget < min) {
        return {
            success: false,
            message: "Budget out of bounds"
        }
    }

    return {
        success: true,
        message: ""
    }
}