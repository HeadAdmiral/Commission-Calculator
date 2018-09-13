window.onload = function(){
  let form = document.getElementById("form");
	
  $("form").submit(function (e) {  
    e.preventDefault();
    processSales();
  });	
}

function formatPrice(price) {
    // If price is negative, change from ($29.99) to -29.99
    if (price.indexOf("(") !== -1){
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
    return (!(parentElement.indexOf(" ") !== -1))
}

function lineBuilder(rawSales){
    rawSales = rawSales.split(/\r?\n/);
    let currentLine = rawSales[0];
    let lineItems = [];
    while (!(isLastElement(currentLine))){
        
        // ex. Where the information for the current line is:
        // 45-PO-6934344 Sale 5 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99
        
        // ==================
        //   TRANSACTION ID
        // ==================       
        let transactionID = currentLine.slice(0, currentLine.indexOf("\t")); // 45-PO-6934344
        currentLine = currentLine.replace(transactionID + "\t", ""); // Sale 5 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99

        // ==================
        //  TRANSACTION TYPE
        // ==================    
        let transactionType = currentLine.slice(0, currentLine.indexOf("\t")); // Sale
        currentLine = currentLine.replace(transactionType + "\t", ""); // 5 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99

        // ==================
        //     LINE NUMBER
        // ==================    
        let lineNumber = currentLine.slice(0, currentLine.indexOf("\t")); // 5
        currentLine = currentLine.replace(lineNumber + "\t", ""); // 480772 CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99
        
        // ==================
        //        SKU
        // ==================      
        let SKU = currentLine.slice(0, currentLine.indexOf("\t")); // 480772
        currentLine = currentLine.replace(SKU + "\t", ""); // CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99 $9.99

        // ==================
        //    DESCRIPTION
        // ==================    
        let description = currentLine.slice(0, currentLine.indexOf("$")); // CAT 5e Snagless Network Cable 10 ft. - Green 1 $9.99
        description = description.slice(0, description.lastIndexOf("\t")); // CAT 5e Snagless Network Cable 10 ft. - Green 1
        description = description.slice(0, description.lastIndexOf("\t")); // CAT 5e Snagless Network Cable 10 ft. - Green
        currentLine = currentLine.replace(description + "\t", ""); // 1 $9.99 $9.99

        // ==================
        //      QUANTITY
        // ==================    
        let quantity = currentLine.slice(0, currentLine.indexOf("\t")); // 1
        currentLine = currentLine.replace(quantity + "\t", ""); // $9.99 $9.99
        
        // ==================
        //        PRICE
        // ==================    
        let itemPrice = currentLine.slice(0, currentLine.indexOf("\t")); // $9.99
        currentLine = currentLine.replace(itemPrice + "\t", ""); // This line is repeated to remove the leading & trailing spaces
	    
        // ==================
        //        TOTAL
        // ==================    
	let transactionPrice = currentLine.slice(0, currentLine.indexOf(" "));
        currentLine = currentLine.replace(transactionPrice + " ", "");
        itemPrice = formatPrice(itemPrice);
	transactionPrice = formatPrice(transactionPrice);
        
        let line = {
            transactionID: transactionID,
            transactionType: transactionType,
            lineNumber: Number(lineNumber),
            sku: SKU,
            desc: description,
            quantity: Number(quantity),
	    price_individual: Number(itemPrice),
            price: Number(transactionPrice),
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
    const COMMISSION_SERVICE_PLAN = 0.1; // 10%
    let commission = 0;

    if (isNotServicePlan(lineItem) && isNotTV(lineItem)) {

        if (lineItem.price < 0){
            if (lineItem.price < 0 && lineItem.price >= -9.99) {
                commission = lineItem.price * COMMISSION_UNDER_TEN;
            }
            else if (lineItem.price < -9.99 && lineItem.price > -99.99) {
                commission = lineItem.price * COMMISSION_UNDER_HUNDRED;
            }
            else if (lineItem.price > 99.99) {
                commission = lineItem.price * COMMISSION_OVER_HUNDRED;
            }
        }

        else {
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
    }

    else {
        if (isServicePlan(lineItem)) {
            commission = lineItem.price * COMMISSION_SERVICE_PLAN;
        }

        else if (isTV(lineItem)) {
            commission = lineItem.price * COMMISSION_OUT_OF_DEPARTMENT;
        }

    }

    return commission;
}

function getCommission(lineItems){
    commission = 0;
    for (let i = 0; i < lineItems.length; i++){
        commission += calculateCommission(lineItems[i]);
    }    
    return commission;
}

function getItemsUnderTen(lineItems) {
    let itemsUnderTen = [];

    for (let i = 0; i < lineItems.length; i++){
        if (isUnderTen(lineItems[i])) {
            itemsUnderTen.push(lineItems[i]);
        }
    }

    return itemsUnderTen;
}

function getItemsUnderHundred(lineItems){
    let itemsUnderHundred = [];

    for (let i = 0; i < lineItems.length; i++){
        if (isUnderHundred(lineItems[i])) {
            itemsUnderHundred.push(lineItems[i]);
        }
    }

    return itemsUnderHundred;

}

function getItemsOverHundred(lineItems){
    let itemsOverHundred = [];

    for (let i = 0; i < lineItems.length; i++){
        if (isOverHundred(lineItems[i])) {
            itemsOverHundred.push(lineItems[i]);
        }
    }

    return itemsOverHundred;

}

function getService(lineItems){
    let service = [];

    for (let i = 0; i < lineItems.length; i++){
        if (isServicePlan(lineItems[i])) {
            service.push(lineItems[i]);
        }
    }
    return service;
}

function getReturns(lineItems){
    let returns = [];

    for (let i = 0; i < lineItems.length; i++){
        if (isReturn(lineItems[i])) {
            returns.push(lineItems[i]);
        }
    } 

    return returns;

}

function getExchanges(lineItems){
    let exchanges = [];

    for (let i = 0; i < lineItems.length; i++){
        if (isExchange(lineItems[i])) {
            exchanges.push(lineItems[i]);
        }
    }

    return exchanges;

}

function isUnderTen(lineItem){
    return lineItem.price > 0 && lineItem.price <= 9.99 && isNotServicePlan(lineItem) && (!isExchange(lineItem)) && (!isReturn(lineItem));
}

function isUnderHundred(lineItem){
    return lineItem.price > 9.99 && lineItem.price <= 99.99 && isNotServicePlan(lineItem) && (!isExchange(lineItem)) && (!isReturn(lineItem));
}

function isOverHundred(lineItem){
    return lineItem.price >= 100.00 && isNotServicePlan(lineItem) && (!isExchange(lineItem)) && (!isReturn(lineItem));
}

function isNotServicePlan(lineItem){
    // Returns true if item description does not contain the following words:
    return lineItem.desc.indexOf("Replacement Plan") === -1 &&
           lineItem.desc.indexOf("replacement plan") === -1;
}

function isServicePlan(lineItem){
    return (!isNotServicePlan(lineItem));
}

function isTV(lineItem){
    return (!isNotTV(lineItem));
}

function isNotTV(lineItem){
    // If item description contains TV...
    if (lineItem.desc.indexOf("TV" !== -1)) {
        // Returns false if item is a TV, and not a TV accessory.
        return isTVAccessory(lineItem);
    }
    return true;
}

function isTVAccessory(lineItem){
    // Returns true if the item description contains any of the following words:
    return lineItem.desc.indexOf("Mount") === -1 ||
           lineItem.desc.indexOf("mount") === -1 ||
           lineItem.desc.indexOf("Antenna") === -1 ||
           lineItem.desc.indexOf("antenna") === -1 ||
           lineItem.desc.indexOf("Antennae") === -1 ||
           lineItem.desc.indexOf("antennae") === -1 ||
           lineItem.desc.indexOf("Box") === -1 ||
           lineItem.desc.indexOf("box") === -1 ||
           lineItem.desc.indexOf("Cable") === -1 ||
           lineItem.desc.indexOf("cable") === -1 ||
           lineItem.desc.indexOf("Tuner") === -1 ||
           lineItem.desc.indexOf("tuner") === -1
}

function isReturn(lineItem){
    return lineItem.transactionType === "Return" && isNotServicePlan(lineItem);
}

function isExchange(lineItem){
    return lineItem.transactionType === "Exchange" && isNotServicePlan(lineItem);
}

function toPercent(a, b){
    return ((a / b) * 100).toFixed(2) + '%';
}

function toDollars(a){
    return a < 0 ? "($" + (a * -1).toFixed(2) + ")" : '$' + a.toFixed(2);
}

function toggleTextBox(){
    let textbox = document.getElementById("lunchlength");
    textbox.disabled = !textbox.disabled;
}

function getPool(hoursWorked){
    return hoursWorked * 2;
}

function getHourly(hoursWorked){
    return hoursWorked * 4;
}

function adjustHoursWorked(hoursWorked, lunchLength){
    hoursWorked -= (lunchLength / 60);
    return hoursWorked;
}

function processSales(){
    let salesData = document.getElementsByName("sales")[0].value;
    let hoursWorked = document.getElementsByName("hoursworked")[0].value;
    let lunchLength = document.getElementsByName("lunchlength")[0].value;
    let lunchTaken = document.getElementsByName("lunched")[0].checked;

    let debug = true;

    // If user is scheduled for 8 hours and takes an hour-long lunch, they have worked 7 hours.
    if (lunchTaken){
        hoursWorked = adjustHoursWorked(hoursWorked, lunchLength);
    }

    // ===============
    // ==== SALES ====
    // ===============
    let lineItems = lineBuilder(salesData);
    let itemsUnderTen = getItemsUnderTen(lineItems);
    let itemsUnderHundred = getItemsUnderHundred(lineItems);
    let itemsOverHundred = getItemsOverHundred(lineItems);

    // ===============
    // === RETURNS ===
    // ===============
    let returns = getReturns(lineItems);

    // ===============
    // == EXCHANGES ==
    // ===============
    let exchanges = getExchanges(lineItems);

    // ===============
    // === SERVICE ===
    // ===============
    let service = getService(lineItems);

    // ===============
    // ==== $$$$$ ====
    // ===============
    let commissionUnderTen = getCommission(itemsUnderTen);
    let commissionUnderHundred = getCommission(itemsUnderHundred);
    let commissionOverHundred = getCommission(itemsOverHundred);
    let commissionService = getCommission(service);
    let commissionReturns = getCommission(returns);
    let commissionExchanges = getCommission(exchanges);
    let commissionPool = getPool(hoursWorked);
    let earnedHourly = getHourly(hoursWorked);
    let totalEarnedWages = commissionUnderTen +
                           commissionUnderHundred +
                           commissionOverHundred +
                           commissionService +
                           commissionReturns +
                           commissionExchanges +
                           commissionPool +
                           earnedHourly;
    let hourlyWage = toDollars(totalEarnedWages / hoursWorked);

    // ===============
    // = SALES STATS =
    // ===============
    let totalTransactions = lineItems.length;
    let totalSalesUnderTen = itemsUnderTen.length;
    let totalSalesUnderHundred = itemsUnderHundred.length;
    let totalSalesOverHundred = itemsOverHundred.length;
    let totalReturns = returns.length;
    let totalExchanges = exchanges.length;
    let totalSales = totalTransactions - totalReturns - totalExchanges;
    let totalService = service.length;
    let percentSalesUnderTen = toPercent(totalSalesUnderTen, totalSales);
    let percentSalesUnderHundred = toPercent(totalSalesUnderHundred, totalSales);
    let percentSalesOverHundred = toPercent(totalSalesOverHundred, totalSales);
    let percentReturns = toPercent(totalReturns, totalTransactions);
    let percentExchanges = toPercent(totalExchanges, totalTransactions);
    let percentService = toPercent(totalService, totalTransactions);

	// ===============
	// = OUTPUT PAGE =
	// ===============
	let salesStatsSalesSubTen = document.getElementById("sales-sub10");
	let salesStatsSalesSubHundred = document.getElementById("sales-sub100");
	let salesStatsSalesOverHundred = document.getElementById("sales-over100");
	let salesStatsPercentSubTen = document.getElementById("pct-sales-sub10");
	let salesStatsPercentSubHundred = document.getElementById("pct-sales-sub100");
	let salesStatsPercentOverHundred = document.getElementById("pct-sales-over100");
	let salesStatsSalesTotal = document.getElementById("total-sales");
	let salesStatsTotalTransactions = document.getElementById("total-transactions");
	
	
	let salesStatsReturns = document.getElementById("returns");
	let salesStatsExchanges = document.getElementById("exchanges");
	
	let salesStatsServicePlans = document.getElementById("service-plans");
	
	let salesStatsCommissionUnder10 = document.getElementById("com-sub10");
	let salesStatsCommissionUnder100 = document.getElementById("com-sub100");
	let salesStatsCommissionOver100 = document.getElementById("com-over100");
	let salesStatsCommissionReturns = document.getElementById("com-returns");
	let salesStatsCommissionExchanges = document.getElementById("com-exchanges");
	let salesStatsCommissionService = document.getElementById("com-service");
	let salesStatsBaseHourly = document.getElementById("base-hourly");
	let salesStatsHourlyRate = document.getElementById("hourly-rate");
	let salesStatsCommissionPool = document.getElementById("com-pool");
	let salesStatsPoolRate = document.getElementById("pool-rate");
	let salesStatsTotalEarnings = document.getElementById("total-earned");
	let salesStatsHourlyWage = document.getElementById("hourly-wage");
		
	salesStatsSalesSubTen.innerText = totalSalesUnderTen;
	salesStatsSalesSubHundred.innerText = totalSalesUnderHundred;
	salesStatsSalesOverHundred.innerText = totalSalesOverHundred;
	salesStatsPercentSubTen.innerText = percentSalesUnderTen;
	salesStatsPercentSubHundred.innerText = percentSalesUnderHundred;
	salesStatsPercentOverHundred.innerText = percentSalesOverHundred;
	salesStatsSalesTotal.innerText = totalSales;
	salesStatsTotalTransactions.innerText = totalTransactions;

	salesStatsReturns.innerText = totalReturns;
	salesStatsExchanges.innerText = totalExchanges;

	salesStatsServicePlans.innerText = totalService;
	
	salesStatsCommissionUnder10.innerText = toDollars(commissionUnderTen);
	salesStatsCommissionUnder100.innerText = toDollars(commissionUnderHundred);
	salesStatsCommissionOver100.innerText = toDollars(commissionOverHundred);
	salesStatsCommissionReturns.innerText = toDollars(commissionReturns);
	salesStatsCommissionExchanges.innerText = toDollars(commissionExchanges);
	salesStatsCommissionService.innerText = toDollars(commissionService);
	salesStatsHourlyRate.innerText = " (" + hoursWorked + "hr(s) at $4/hr)";
	salesStatsBaseHourly.innerHTML = toDollars(earnedHourly)
	salesStatsPoolRate.innerText = " (" + hoursWorked + "hr(s) at ~$2/hr)";
	salesStatsCommissionPool.innerText = toDollars(commissionPool);
// 	salesStatsTotalEarnings.innerText = toDollars(totalEarnedWages);
// 	salesStatsHourlyWage.innerText = hourlyWage;
	
	
	
    // ===============
    // ==== DEBUG ====
    // ===============
    if (debug) {
        console.log("===== COMMISSION CALCULATOR =====");
        console.log("Hours worked: " + hoursWorked);
        console.log("Lunch taken: " + lunchTaken);
        if (lunchTaken){
            console.log("Lunch length: " + lunchLength + " minutes");
        }
        console.log("Sales Information:");
        console.log(lineItems);
        console.log("============= SALES =============");
        console.log("Under $10:");
        console.log(itemsUnderTen);
        console.log("Under $100:");
        console.log(itemsUnderHundred);
        console.log("Over $100:");
        console.log(itemsOverHundred);
        console.log("============ RETURNS ============");
        console.log("Returns:");
        console.log(returns);
        console.log("=========== EXCHANGES ===========");
        console.log("Exchanges:");
        console.log(exchanges);
        console.log("============ SERVICE ============");
        console.log("Service:");
        console.log(service);
        console.log("============= STATS =============");
        console.log("Total transactions: " + totalTransactions);
        console.log("Total sales under $10: " + totalSalesUnderTen);
        console.log("Total sales under $100: " + totalSalesUnderHundred);
        console.log("Total sales over $100: " + totalSalesOverHundred);
        console.log("");
        console.log("Percentage of sales under $10: " + percentSalesUnderTen);
        console.log("Percentage of sales under $100: " + percentSalesUnderHundred);
        console.log("Percentage of sales over $100: " + percentSalesOverHundred);
        console.log("");
        console.log("Total service plans: " + totalService);
        console.log("Total returns: " + totalReturns);
        console.log("Total exchanges: " + totalExchanges);
        console.log("");
        console.log("Percentage of service plans to transactions: " + percentService);
        console.log("Percentage of returns to transactions: " + percentReturns);
        console.log("Percentage of exchanges to transactions: " + percentExchanges);
        console.log("======= EARNED COMMISSION =======");
        console.log("Under $10: " + toDollars(commissionUnderTen));
        console.log("Under $100: " + toDollars(commissionUnderHundred));
        console.log("Over $100: " + toDollars(commissionOverHundred));
        console.log("Service: " + toDollars(commissionService));
        console.log("Returns: " + toDollars(commissionReturns));
        console.log("Exchanges: " + toDollars(commissionExchanges));
        console.log("");
        console.log("Earned hourly: " + toDollars(earnedHourly) + "(" + hoursWorked + "hr(s) worked at $4/hr)");
        console.log("Estimated pool commission: " + toDollars(commissionPool) + "(" + hoursWorked + "hr(s) worked at ~$2/hr");
        console.log("Total earned wages: " + toDollars(totalEarnedWages));
        console.log("============= TOTALS ============");
        console.log(toDollars(commissionUnderTen + commissionUnderHundred + commissionOverHundred) + "(Sales) + " +
                    toDollars(commissionService) + "(Service Plans) + " +
                    toDollars(commissionPool) + "(Estimated Pool) + " +
                    toDollars(earnedHourly) + "(Earned Hourly) + " +
                    toDollars(commissionReturns) + "(Returns) + " +
                    toDollars(commissionExchanges) + "(Exchanges) + " +
                    " = " + toDollars(totalEarnedWages));
        console.log(toDollars(totalEarnedWages) + " / " + hoursWorked + "hr(s) worked = " + hourlyWage + "/hr");
    }
	
    toggleOutput(hourlyWage);
}

function toggleOutput(hourlyWage) {
    let input = document.getElementById("form-content");
    let output = document.getElementById("output");
    let commission = document.getElementById("commission");
    
    input.style.display = "none";
    commission.innerText = hourlyWage;
    output.style.display = "block";
    document.body.style.backgroundColor = "#24b662";
}

function showStats(){
    let salesStats = document.getElementById("stats");
    let detailsButton = document.getElementById("details");
	
    if (detailsButton.innerText === "＋"){
        detailsButton.innerText = "－";
	    salesStats.style.display = "block";
    }

    else if (detailsButton.innerText === "－"){
	    detailsButton.innerText = "＋";
		salesStats.style.display = "none";
    }
}
