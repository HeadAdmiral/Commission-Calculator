let salesData;

function formatPrice(price) {
    // If price is negative, change from ($29.99) to -29.99
    if (price.indexOf("(") != -1){
        price = price.replace("(", "");
        price = price.replace("$", "-");
        price = price.replace(")", "");
    }

    // If price is positive, change from $29.99 to 29.99
    else{
        price = price.replace("$", "");
    }
    
    return price;
}

function isLastElement(parentElement){
    // Returns true if parentElement does not contain spaces (ie. there are no elements after the current one)
    return (!(parentElement.indexOf(" ") != -1))
}

function lineBuilder(rawSales){
    rawSales = rawSales.split(/\r?\n/);
    let currentLine = rawSales[0];
    let lineItems = [];
    while (!(isLastElement(currentLine))){
        
        // Where the information for the current line is:
        // 45-PO-6934344 Sale 5 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99
        
        // ==================
        //   TRANSACTION ID
        // ==================       
        let transactionID = currentLine.slice(0, currentLine.indexOf(" ")); // 45-PO-6934344
        currentLine = currentLine.replace(transactionID + " ", ""); // Sale 5 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99

        // ==================
        //  TRANSACTION TYPE
        // ==================    
        let transactionType = currentLine.slice(0, currentLine.indexOf(" ")); // Sale
        currentLine = currentLine.replace(transactionType + " ", ""); // 5 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99

        // ==================
        //     LINE NUMBER
        // ==================    
        let lineNumber = currentLine.slice(0, currentLine.indexOf(" ")); // 5
        currentLine = currentLine.replace(lineNumber + " ", ""); // 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99
        
        // ==================
        //        SKU
        // ==================      
        let SKU = currentLine.slice(0, currentLine.indexOf(" ")); // 480772
        currentLine = currentLine.replace(SKU + " ", ""); // CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99

        // ==================
        //    DESCRIPTION
        // ==================    
        let description = currentLine.slice(0, currentLine.indexOf("$")); // CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99
        description = description.slice(0, description.lastIndexOf(" ")); // CAT 5e Snagless Network Cable 10 ft. - Green 1
        description = description.slice(0, description.lastIndexOf(" ")); // CAT 5e Snagless Network Cable 10 ft. - Green
        currentLine = currentLine.replace(description + " ", ""); // 1 $9.99 $9.99

        // ==================
        //      QUANTITY
        // ==================    
        let quantity = currentLine.slice(0, currentLine.indexOf(" ")); // 1
        currentLine = currentLine.replace(quantity + " ", ""); // $9.99 $9.99
        
        // ==================
        //        PRICE
        // ==================    
        let price = currentLine.slice(0, currentLine.indexOf(" ")); // $9.99
        currentLine = currentLine.replace(price + " ", ""); // This line is repeated to remove the leading & trailing spaces
        currentLine = currentLine.replace(price + " ", ""); // and also to get rid of the duplicate price
        price = formatPrice(price);
        
        let line = {
            transactionID: transactionID,
            transactionType: transactionType,
            lineNumber: Number(lineNumber),
            sku: SKU,
            desc: description,
            quantity: Number(quantity),
            price: Number(price)
        };
        
        lineItems.push(line);
     }
    return lineItems;
}

function calculateCommission(lineItem){
    const COMMISSION_OUT_OF_DEPARTMENT = 0.0075; // 0.75%
    const COMMISSION_UNDER_TEN = 0.06; // 6%
    const COMMISSION_UNDER_HUNDRED = 0.03; // 3%
    const COMMISSION_OVER_HUNDRED = 0.015; // 1.5%
    let commission;
    
    // If not a service plan
    // If not a TV
    
    // Maybe make a method that determines what kind of item the lineItem is, and then go from there in this method.
    if (lineItem.price > 0 && lineItem.price <= 9.99) {
        commission = lineItem.price * COMMISSION_UNDER_TEN;
    }
    else if (lineItem.price > 9.99 && lineItem.price <= 99.99) {
        commission = lineItem.price * COMMISSION_UNDER_HUNDRED;
    }
    else if (lineItem.price > 99.99) {
        commission = lineItem.price * COMMISSION_OVER_HUNDRED;
    }

} 

function getItemsUnderTen(lineItems) {
    for (let i = 0; i < lineItems.length; i++){
        console.log(lineItems[i].price);
    }
}


function printme(){
    salesData = document.getElementsByName("sales")[0].value;
    let lineItems = lineBuilder(salesData);
    console.log(lineItems);
    let itemsUnderTen = getItemsUnderTen(lineItems)
}
