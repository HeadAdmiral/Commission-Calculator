function toggleTextBox(){
    var textbox = document.getElementById("lunchlength");
    textbox.disabled = !textbox.disabled;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function outOfDepartmentCorrection(priceParsedURL){
    var priceAdjustment = 0;
    var showAlert = false;
    // Loop through sales
    for (var i = 4; i < priceParsedURL.length; i += 4){
        // Look for descriptions containing TV but not mount
        if (priceParsedURL[i].includes("TV")){
            if (!(priceParsedURL[i].includes("Mount"))){
                // Adjust commission earned by -0.25% (the amount it should be wrong by)
                if (i + 3 <= priceParsedURL.length){
                priceAdjustment -= Number(priceParsedURL[i+3].replace('$','') * 0.025);
                //console.log("Price reduced by " + Number(priceParsedURL[i+3].replace('$','') * 0.025));
                }
                // This will not work if a TV is the last item on the list (aka the first thing someone sold), as it will throw an index out of bounds error.
                else{
                    showAlert = true;
                }
            }
        }
    }
    // Show error message
    if (showAlert){
        alert("Due to a TV sale, your wage cannot be calculated correctly. It is slightly higher than it should be.");
    }
    //console.log("Total reduction: " + priceAdjustment);
    return priceAdjustment;
}

function sum(underTen, underHundred, underThousand, underTenThousand, underHundredThousand, add){
    var total;
    var subTen;
    var subHundred;
    var subThousand;
    var subTenThousand;
    var subHundredThousand;

    var commissionUnderTen = 0.06; // 6%
    var commissionUnderHundred = 0.03; // 3%
    var commissionUnderThousand = 0.015; // 1%
    var commissionOutOfDept = 0.0075; // 0.75%

    switch (add){
        case (true):
            // The casting is necessary because it keeps concatenating instead of adding.
            subTen = Number(parsePriceFromURL(underTen) * commissionUnderTen).toFixed(2);
            subHundred = Number(parsePriceFromURL(underHundred) * commissionUnderHundred).toFixed(2);
            subThousand = Number(parsePriceFromURL(underThousand) * commissionUnderThousand).toFixed(2);
            subTenThousand = Number(parsePriceFromURL(underTenThousand) * commissionUnderThousand).toFixed(2);
            subHundredThousand = Number(parsePriceFromURL(underHundredThousand) * commissionUnderThousand).toFixed(2);

            break;

        case (false):
            // The casting is necessary because it keeps concatenating instead of adding.
            subTen = Number(parseReturnFromURL(underTen) * commissionUnderTen).toFixed(2);
            subHundred = Number(parseReturnFromURL(underHundred) * commissionUnderHundred).toFixed(2);
            subThousand = Number(parseReturnFromURL(underThousand) * commissionUnderThousand).toFixed(2);
            subTenThousand = Number(parseReturnFromURL(underTenThousand) * commissionUnderThousand).toFixed(2);
            subHundredThousand = Number(parseReturnFromURL(underHundredThousand) * commissionUnderThousand).toFixed(2);

        default:
            break;
    }

    if (add === true) {
        console.log("===== EARNED COMMISSION =====");
    }
    else {
        console.log("===== RETURNS / EXCHANGES =====")
    }
    //console.log(underTen);
    console.log("Under ten: " + subTen);
    console.log("Under hundred: " + subHundred);
    console.log("Under thousand: " + subThousand);
    console.log("Under ten thousand: " + subTenThousand);
    console.log("Under hundred thousand: " + subHundredThousand);
    

    // Account for TV sales being calculated as 1% instead of 0.75%
    total -= outOfDepartmentCorrection(underThousand);
    total -= outOfDepartmentCorrection(underTenThousand);
    total -= outOfDepartmentCorrection(underHundredThousand);

    total = (Number(subTen) +
            Number(subHundred) +
            Number(subThousand) +
            Number(subTenThousand) +
            Number(subHundredThousand)).toFixed(2);
    
    console.log("Total: " + subTen + " + "
                          + subHundred + " + " 
                          + subThousand + " + "
                          + subTenThousand + " + " 
                          + subHundredThousand + " = "
                          + total);
    console.log("=============================");
return total;
}

function getNextCharacter(str, from, lookingForLunch) {
    // If the string includes the quantifier from, attempt to get the next character
    // This is necessary to get proper output from strings of length greater than 1.
    if (str.includes(from)) {
        if (!(lookingForLunch)) {
            if (from.length === 1) {
                var index = str.indexOf(from) + 1;
			if (str.charAt(index+1) === "."){
				if (!(isNaN(str.charAt(index+2)))){
					if (!(isNaN(str.charAt(index+3)))){
						return str.substring(index, index + 4);
}
					return str.substring(index, index + 3);
				}
                     return str.substring(index, index + 2);
			}
			else if (!(isNaN(str.charAt(index+1)))){
			    return str.substring(index, index + 2);
            }
                return str.substring(index, index + 1);
            }
            else {
                var index = str.indexOf(from) + from.length;
                return str.substring(index, index + 1);
            }
        }
        else{
            var index = str.indexOf(from) + from.length;
            return str.substring(index, index + 2);
        }
    }
    // Otherwise, don't bother
    else{
        return "";
    }
}

function parsePriceFromURL(url){
    if (!(typeof url[1] === "undefined")) {
        var price = 0;
        for (var i = 3; i < url.length; i += 4) {
            priceToAdd = Number(url[i].replace('$', ''));
            price += priceToAdd;

             /* ===== DEBUG =====
            console.log("Adding index " + i + " to price");
            console.log("Item is " + url[i]);
            console.log("Adding " + priceToAdd + " to total");
            console.log(price);
            console.log("=====");
            */
        }
        return price.toFixed(2);
    }
    else{
        return 0;
    }
}

function parseReturnFromURL(url){
    if (!(typeof url[1] === "undefined")) {
        var returns = 0;
        for (var i = 3; i < url.length; i += 4) {
            returnToAdd = Number(url[i].replace('$', '').replace('(', '-').replace(')', ''));
            returns += returnToAdd;

            /* ===== DEBUG =====
            console.log("Adding index " + i + " to price");
            console.log(returns);
            console.log("=====");
            */

        }
        return returns.toFixed(2);
    }
    else{
        return 0;
    }
}

function parseURL(){
    var url = document.URL;
    var headerText = document.getElementById("commission");

    // Convert URL-encoded characters back to the original character
    // To add more, visit this URL: http://www.vermontdatabase.com/cloudwriter/url_encoding.htm
    url = replaceAll(url, "%28%24", "(");
    url = replaceAll(url, "%28", "(");
    url = replaceAll(url, "%29", ")");
    url = replaceAll(url, "%24", "$");
    url = replaceAll(url, "%2F", "/");
    url = replaceAll(url, "%2C", "");
    url = replaceAll(url, "+", " ");
    url = replaceAll(url, "%09", " ");
    url = replaceAll(url, "%3B", ";");
    url = replaceAll(url, "%22", "\"");
    url = replaceAll(url, "%2B", "+");
    url = replaceAll(url, "%26", "&");
    url = replaceAll(url, "%3A", ":");

    // Remove from URL the following: FileLocation/sales_page.html?
    var unparsedParams = url.substring(url.indexOf("?")+1);
    // Split up the params from the first page and put them in an array
    var params = unparsedParams.split("&");

    unparsedParams = unparsedParams.replace(/\t/g, " ");

    // ===== Sales =====
    var underTenPrices = unparsedParams.split(/(\s[$]\d.\d\d)/gm);
    var underOneHundredPrices = unparsedParams.split(/(\s[$]\d\d.\d\d)/gm);
    var underOneThousandPrices = unparsedParams.split(/(\s[$]\d\d\d.\d\d)/gm);
    var underTenThousandPrices = unparsedParams.split(/(\s[$]\d\d\d\d.\d\d)/gm);
    var underOneHundredThousandPrices = unparsedParams.split(/(\s[$]\d\d\d\d\d.\d\d)/gm);
    var totalOfSales = 0;

    // ===== Returns / Dropped Exchanges =====
    var underTenReturns = unparsedParams.split(/([(]\d.\d\d[)])/gm);
    var underOneHundredReturns = unparsedParams.split(/([(]\d\d.\d\d[)])/gm);
    var underOneThousandReturns = unparsedParams.split(/([(]\d\d\d.\d\d[)])/gm);
    var underTenThousandReturns = unparsedParams.split(/([(]\d\d\d\d.\d\d[)])/gm);
    var underOneHundredThousandReturns = unparsedParams.split(/([(]\d\d\d\d\d.\d\d[)])/gm);
    var totalOfReturns = 0;



    // Store variables
    var hoursWorked = getNextCharacter(unparsedParams, "=", false); // hoursworked=#
    var lunchLength = getNextCharacter(unparsedParams, "lunchlength=", true); // lunchlength=##
    var lunchTaken = false;

    // If params is greater than 1 (meaning the employee has taken a lunch), initialize the variables.
    if (unparsedParams.includes("lunchlength")){
        lunchTaken = true;
        hoursWorked -= (lunchLength / 60);
    }

    totalOfSales = sum(underTenPrices,
        underOneHundredPrices,
        underOneThousandPrices,
        underTenThousandPrices,
        underOneHundredThousandPrices,
        true);

    totalOfReturns = sum(underTenReturns,
        underOneHundredReturns,
        underOneThousandReturns,
        underTenThousandReturns,
        underOneHundredThousandReturns,
        false);

    var pool = Number(hoursWorked * 2).toFixed(2); // Pool is roughly $2/hr on average
    var earnedHourly = Number(hoursWorked * 4).toFixed(2); // Average hourly is $4/hr
    var earnedWages = (Number(totalOfSales) + Number(totalOfReturns) + Number(pool) + Number(earnedHourly)).toFixed(2);
    var hourlyWage = Number(earnedWages / hoursWorked).toFixed(2);

    // ===== DEBUG =====
    console.log("Hours worked: " + hoursWorked + " hours");
    console.log("Lunch taken: " + lunchTaken);
    console.log("Lunch length: " + lunchLength + " minutes");
    //console.log("Unparsed Params: " + unparsedParams);

    console.log("Total of Sales: " + totalOfSales);
    console.log("Total of Returns: " + totalOfReturns);
    console.log("Estimated pool commission: " + pool);
    console.log("=============================");
    console.log("Total: " + totalOfSales + "(Sales) + "
                          + totalOfReturns + "(Returns) + "
                          + pool + "(Estimated Pool) + "
                          + earnedHourly + "(Hourly) = $"
                          + earnedWages);
    console.log("Total: $" + earnedWages + " / "
                           + hoursWorked + "hrs worked = $"
                           + hourlyWage + "/hr");

    headerText.innerText = "$" + hourlyWage;
    
}