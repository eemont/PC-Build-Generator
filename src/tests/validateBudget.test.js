import { expect, test, describe } from "vitest"
import { validateBudget } from "../utils/validateBudget.js"

describe("Validate Budget", () => {
    test.each([300, 1000, 1200.50, 10000])("Valid budget passes: %s", (val) => {
        expect(validateBudget(val)).toEqual({
            success: true,
            message: ""
        });
    });

    test.each(["100.0.2", "", " ", "abc", "$1000"])("Invalid budget format fails: %s", (val) => {
        expect(validateBudget(val)).toEqual({
            success: false,
            message: "Invalid budget format"
        });
    });

    test.each([-999, 5, 1293819230920381])("Budget out of bounds fails: %s", (val) => {
        expect(validateBudget(val)).toEqual({
            success: false,
            message: "Budget out of bounds"
        })
    })
});
