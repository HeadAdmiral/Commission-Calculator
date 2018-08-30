function isLastElement(parentElement){
    return (parentElement.indexOf(" ") != -1)
}

function lineBuilder(rawSales){
    rawSales = rawSales.split(/\r?\n/);
    let currentLine = rawSales[0];
    let counter = 0;
    while (!(isLastElement(currentLine))){
        //console.log(currentLine);
        let transactionID = currentLine.slice(0, currentLine.indexOf(" "));
        console.log(transactionID);
        currentLine = currentLine.replace(transactionID + " ", "");
        //console.log(currentLine);

        let transactionType = currentLine.slice(0, currentLine.indexOf(" "));
        console.log(transactionType);
        currentLine = currentLine.replace(transactionType + " ", "");
        //console.log(currentLine);

        let lineNumber = currentLine.slice(0, currentLine.indexOf(" "));
        console.log(lineNumber);
        currentLine = currentLine.replace(lineNumber + " ", "");
        //console.log(currentLine);

        let SKU = currentLine.slice(0, currentLine.indexOf(" "));
        console.log(SKU);
        currentLine = currentLine.replace(SKU + " ", "");
        //console.log(currentLine);

        let description = currentLine.slice(0, currentLine.indexOf("$"));
        //console.log(currentLine);
        description = description.slice(0, description.lastIndexOf(" "));
        description = description.slice(0, description.lastIndexOf(" "));
        console.log(description);
        currentLine = currentLine.replace(description + " ", "");
        //console.log(currentLine);
        let quantity = currentLine.slice(0, currentLine.indexOf(" "));
        console.log(quantity);
        currentLine = currentLine.replace(quantity + " ", "");
        let price = currentLine.slice(0, currentLine.indexOf(" "));
        price = currentLine.slice(0, currentLine.indexOf(" "));
        currentLine = currentLine.replace(price + " ", "");
        currentLine = currentLine.replace(price + " ", "");
        //console.log(currentLine);
        console.log(price);
        console.log("==========");
        console.log(currentLine);
        console.log(currentLine.length);
        console.log("==========");
        counter++;
     }
    console.log("Done!");
    //let line = {
        
}

let salesInfo;
function printme(){
    salesInfo = document.getElementsByName("sales")[0].value
    lineBuilder(salesInfo);
}
