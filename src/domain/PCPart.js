export class PCPart {
    $ = null;

    brand = "";
    model = "";
    price = 0.0;        // dollars
    
    img = "";
    link = "";          // url to part on pcpartpicker.com

    constructor(brand, model, price, img = "", link = "") {
        this.brand = brand;
        this.model = model;
        this.price = price;
        this.img = img;
        this.link = link;
    }

    // take json from api and convert to object
    static decode(partObj) {
        const price = parseFloat((Array.isArray(partObj.price) 
            ? +partObj.price[1]
            : partObj.price).toFixed(2));

        return {
            brand: partObj.brand.toLowerCase(),
            model: partObj.model.toLowerCase(),
            price,
        };
    }

    // take row from Supabase/Postgres and normalize shared fields
    static fromRow(row) {
        return {
            brand: (row.brand || "").toLowerCase(),
            model: (row.model || "").toLowerCase(),
            price: parseFloat(Number(row.price || 0).toFixed(2)),
            img: row.img || "",
            link: row.link || "",
        };
    }

    toSearchQuery() {
        const formattedQuery = `${this.brand} ${this.model}`.trim().split(" ").join("+");
        return "https://pcpartpicker.com/search/?q=" + formattedQuery;
    }
}