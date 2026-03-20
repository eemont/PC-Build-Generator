import { operatorHandler } from "./partsApi";

export class PCPart {
    id = null;

    brand = "";
    model = "";
    price = 0.0;        // dollars
    
    img = "";
    link = "";          // url to part on pcpartpicker.com

    constructor({ id, brand, model, price, img = "", link = "" }) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.img = img;
        this.link = link;
    }

    // take row from Supabase/Postgres and normalize shared fields
    static fromRow(row) {
        return {
            id: row.id,
            brand: (row.brand || "").toLowerCase(),
            model: (row.model || "").toLowerCase(),
            price: parseFloat(Number(row.price || 0).toFixed(2)),
            img: row.img || "",
            link: row.link || "",
        };
    }

    makeConstraint({
        dbField, 
        domainField,
        op = null, 
        val = null,
        message = null,
        isMissing = false
    }) {
        const severity = isMissing ? 'warning' : 'error';

        const displayVal = Array.isArray(val)
            ? val.join(', ')
            : val;
        let displayMessage = message || `${domainField} must be ${operatorHandler[op].text} ${displayVal}`;
        if (isMissing) {
            displayMessage = `${domainField} compatibility unknown`;
        }

        return {
            field: {
                db: dbField,
                domain: domainField
            }, 
            op,
            val,
            message: displayMessage,
            severity
        };
    }
}