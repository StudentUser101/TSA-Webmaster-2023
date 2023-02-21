//Global variables of ticket costs for different age groups - Children are 7-17, adults are 18-64, seniors are 65+. Children under 7 are not allowed
var children_base_cost = 400;
var children_real_cost = 400;
var children_group_cost_value = 0;

var adults_base_cost = 700;
var adults_real_cost = 700;
var adults_group_cost_value = 0;

var seniors_base_cost = 400;
var seniors_real_cost = 400;
var seniors_group_cost_value = 0;

var total_cost_value = 0;

//Other global variables relating to scheduling a trip
var selectedrocket = Rocket56;
var go_VIP = false;
var numchildren = 0;
var numadults = 0;
var numseniors = 0;
var num_passengers = 0;
var OutboundDate = "2023-01-01";
var OutboundTime = "12";
var ReturnDate = "2023-12-31";
var ReturnTime = "12";

//Objects holding data for each of the rockets.
var Rocket56 = {name: "Rocket 56", child_cost: 400, adult_cost: 700, senior_cost: 400, max_passengers_per_ticket: 7};
var Rocket61 = {name: "Rocket 61", child_cost: 300, adult_cost: 500, senior_cost: 300, max_passengers_per_ticket: 3};
var Rocket66 = {name: "Rocket 66", child_cost: 600, adult_cost: 1000, senior_cost: 600, max_passengers_per_ticket: 7};
var Rocket75 = {name: "Rocket 75", child_cost: 1000, adult_cost: 1000, senior_cost: 1000, max_passengers_per_ticket: 10};

//This function is called whenever the table is updated, or a rocket is selectd, or the user selects whether or not they want VIP tickets. It updates everything, including the ticket
function UpdateTicketChoice(children_id, adults_id, seniors_id, peopleid, total_cost_id, avg_cost_text, avg_cost_id, max_people_id) {
    //Which rocket is selected?
    if (document.getElementById("chosen_rocket").selectedIndex == 0) {
        selectedrocket = Rocket56;
    }
    else if (document.getElementById("chosen_rocket").selectedIndex == 1) {
        selectedrocket = Rocket61;
    }
    else if (document.getElementById("chosen_rocket").selectedIndex == 2) {
        selectedrocket = Rocket66;
    }
    else if (document.getElementById("chosen_rocket").selectedIndex == 3) {
        selectedrocket = Rocket75;
    }


    //Set the global cost variables according to which rocket is selected
    children_base_cost = selectedrocket.child_cost;
    children_real_cost = children_base_cost;
    adults_base_cost = selectedrocket.adult_cost;
    adults_real_cost = adults_base_cost;
    seniors_base_cost = selectedrocket.senior_cost;
    seniors_real_cost = seniors_base_cost;
    document.getElementById(max_people_id).innerHTML = selectedrocket.max_passengers_per_ticket;

    //Has VIP been selected?
    if (document.getElementById("vip_ticket").selectedIndex == 0) {
        children_real_cost = children_base_cost;
        adults_real_cost = adults_base_cost;
        seniors_real_cost = seniors_base_cost;
        go_VIP = false;
    }
    else if (document.getElementById("vip_ticket").selectedIndex == 1) {
        children_real_cost = children_base_cost + 500;
        adults_real_cost = adults_base_cost + 500;
        seniors_real_cost = seniors_base_cost + 500;
        go_VIP = true;
    }

    //Set the outbound date, outbound time, return date, and return time according to which options have been selected
    OutboundDate = document.getElementById("outbound_date").value;
    ReturnDate = document.getElementById("return_date").value;

    if (document.getElementById("outbound_time").selectedIndex == 0) {
        OutboundTime = "12";
    }
    else if (document.getElementById("outbound_time").selectedIndex == 1) {
        OutboundTime = "6";
    }

    if (document.getElementById("return_time").selectedIndex == 0) {
        ReturnTime = "12";
    }
    else if (document.getElementById("return_time").selectedIndex == 1) {
        ReturnTime = "6";
    }

    //Set the cost per individual boxes according to which rocket has been selected
    document.getElementById("price_for_" + children_id).innerHTML = "$" + children_real_cost + " per child";
    document.getElementById("price_for_" + adults_id).innerHTML = "$" + adults_real_cost + " per adult";
    document.getElementById("price_for_" + seniors_id).innerHTML = "$" + seniors_real_cost + " per senior";

    //How many children, adults, and seniors are on the ticket? How many passengers in total are on the ticket?
    numchildren = parseInt(document.getElementById("num_" + children_id).value);
    numadults = parseInt(document.getElementById("num_" + adults_id).value);
    numseniors = parseInt(document.getElementById("num_" + seniors_id).value);
    num_passengers = numchildren + numadults + numseniors;

    //What's the combined cost of all the children tickets? Of all the adult tickets? Of all the senior tickets? Of all the tickets combined?
    children_group_cost_value = numchildren * children_real_cost;
    adults_group_cost_value = numadults * adults_real_cost;
    seniors_group_cost_value = numseniors * seniors_real_cost;
    total_cost_value = children_group_cost_value + adults_group_cost_value + seniors_group_cost_value;

    //Take the values obtained and calculated so far, and insert them into the table
    document.getElementById(peopleid).innerHTML = num_passengers;
    document.getElementById(children_id + "_costs").innerHTML = children_group_cost_value;
    document.getElementById(adults_id + "_costs").innerHTML = adults_group_cost_value;
    document.getElementById(seniors_id + "_costs").innerHTML = seniors_group_cost_value;
    document.getElementById(total_cost_id).innerHTML = total_cost_value;

    //Find the average cost in dollars, to the nearest cent, and insert it into the table
    if (parseInt(document.getElementById(peopleid).innerHTML) == 0) {
        var avg_cost = 0;
    }
    else {
        var avg_cost = Math.trunc(total_cost_value / parseInt(document.getElementById(peopleid).innerHTML) * 100) / 100;
    }
    document.getElementById(avg_cost_id).innerHTML = avg_cost_text + avg_cost;
    
    var TicketFrame = document.getElementById("TicketFrame").contentWindow;
    PrintMainTicketInfo("children", "adults", "seniors", "people", "total_cost", TicketFrame);
}

//This function is called when the 'Print ticket' button is pressed. It ensure there aren't too many people on the ticket, and then prints the ticket
function PrintTicket() {
    if (window.confirm("This ticket will not be saved. You must store a copy of it yourself.\n\nAre you sure you want to continue?") == true) {
        var OutboundDay = parseInt(OutboundDate.substring(8));
        var OutboundMonth = parseInt(OutboundDate.substring(5, 7));
        var OutboundYear = parseInt(OutboundDate.substring(0, 4));
        var ReturnDay = parseInt(ReturnDate.substring(8));
        var ReturnMonth = parseInt(ReturnDate.substring(5, 7));
        var ReturnYear = parseInt(ReturnDate.substring(0, 4));

        if (isNaN(OutboundDay) || isNaN(OutboundMonth) || isNaN(OutboundYear)) {
            window.alert("Invalid timings: Selected outbound date is not a valid date");
        }
        else if (isNaN(ReturnDay) || isNaN(ReturnMonth) || isNaN(ReturnYear)) {
            window.alert("Invalid timings: Selected return date is not a valid date");
        }
        else if (((parseInt(OutboundTime) - parseInt(ReturnTime)) == -6 && (ReturnDay - 1) == OutboundDay && ReturnMonth == OutboundMonth && ReturnYear == OutboundYear) || (ReturnDay <= OutboundDay && ReturnMonth == OutboundMonth && ReturnYear == OutboundYear) || (ReturnMonth < OutboundMonth && ReturnYear == OutboundYear) || (ReturnYear < OutboundYear)) {
            window.alert("Invalid timings: Return trip must be scheduled at least 24 hours after outbound trip");
        }
        else if (num_passengers > selectedrocket.max_passengers_per_ticket) {
            window.alert("Invalid number of passengers: Number of people on ticket exceeds ticket capacity");
        }
        else if (num_passengers <= 0) {
            window.alert("Invalid number of passengers: There must be at least one person on the ticket");
        }
        else {
            var TicketPrint = window.frames["TicketFrame"];
            TicketPrint.focus();
            TicketPrint.print();
        }
    }
}

//A helper function for the 'UpdateTicketChoice' function
function PrintMainTicketInfo(children_id, adults_id, seniors_id, total_people_id, total_cost_id, tab) {
    tab.document.getElementById("rocket_type").innerHTML = selectedrocket.name;
    
    if (go_VIP) {
        tab.document.getElementById("VIP_checking").innerHTML = "VIP";
    }
    else {
        tab.document.getElementById("VIP_checking").innerHTML = "regular";
    }

    tab.document.getElementById("outbound_date").innerHTML = OutboundDate.substring(5, 7) + "/" + OutboundDate.substring(8) + "/" + OutboundDate.substring(0, 4);
    tab.document.getElementById("outbound_time").innerHTML = OutboundTime;
    tab.document.getElementById("return_date").innerHTML = ReturnDate.substring(5, 7) + "/" + ReturnDate.substring(8) + "/" + ReturnDate.substring(0, 4);
    tab.document.getElementById("return_time").innerHTML = ReturnTime;

    tab.document.getElementById("num_" + children_id).innerHTML = numchildren;
    tab.document.getElementById("num_" + adults_id).innerHTML = numadults;
    tab.document.getElementById("num_" + seniors_id).innerHTML = numseniors;
    tab.document.getElementById("num_" + total_people_id).innerHTML = num_passengers;

    tab.document.getElementById("cost_per_" + children_id).innerHTML = children_real_cost;
    tab.document.getElementById("cost_per_" + adults_id).innerHTML = adults_real_cost;
    tab.document.getElementById("cost_per_" + seniors_id).innerHTML = seniors_real_cost;

    tab.document.getElementById(children_id + "_group_cost").innerHTML = children_group_cost_value;
    tab.document.getElementById("add_" + children_id + "_group_cost").innerHTML = children_group_cost_value;
    tab.document.getElementById(adults_id + "_group_cost").innerHTML = adults_group_cost_value;
    tab.document.getElementById("add_" + adults_id + "_group_cost").innerHTML = adults_group_cost_value;
    tab.document.getElementById(seniors_id + "_group_cost").innerHTML = seniors_group_cost_value;
    tab.document.getElementById("add_" + seniors_id + "_group_cost").innerHTML = seniors_group_cost_value;
    tab.document.getElementById(total_cost_id).innerHTML = total_cost_value;
    tab.document.getElementById("add_" + total_cost_id).innerHTML = total_cost_value;




//    tab.print();
}