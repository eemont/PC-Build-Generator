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
}