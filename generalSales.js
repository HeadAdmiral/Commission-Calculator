function lineBuilder(rawSales){
    rawSales = rawSales.split(/\r?\n/);

    // while (rawSales.length > 0){
        let currentLine = rawSales[0];

        let transactionID = currentLine.slice(0, currentLine.indexOf(""));
        console.log(transactionID);
        currentLine = currentLine.replace(transactionID, "");

        let transactionType = currentLine.slice(0, currentLine.indexOf(""));
        console.log(transactionType);
        currentLine = currentLine.replace(transactionType, "");

        let lineNumber = currentLine.slice(0, currentLine.indexOf(""));
        console.log(lineNumber);
        currentLine = currentLine.replace(lineNumber, "");

        let SKU = currentLine.slice(0, currentLine.indexOf(""));
        console.log(SKU);
        currentLine = currentLine.replace(SKU, "");

        let description = currentLine.slice(0, currentLine.indexOf("$"));
        console.log(description);
        
        
        
        
        
    // }
}

let salesInfo;
function printme(){
    salesInfo = document.getElementsByName("sales")[0].value
    lineBuilder(salesInfo);
}
