// Defines constants that refer to HTML page elements
const partTable = document.getElementById("parts-table");
const rowArray = document.getElementsByClassName("part-row");
const pageSelectInfo = document.getElementById("page-select-information");
const librefs = document.getElementsByClassName("libref");
const logType = document.getElementsByClassName("");
const searchTerm = document.getElementById("part-search");
const searchType = document.getElementById("part-search-option");
const changetype = document.getElementById("type-filter");

// Refers to the select buttons at the bottom of the page. [0] refers to left button, [1] refers to right button
const pageButtons = document.getElementsByClassName("page-select-button");
// Defines global variables used in multiple functions
let page;
let numResults;
let startResult;
let endResult;
let globalData;

// Handles making an API query when a search is made
function dataFetch() {
  console.log(searchTerm.value);
  console.log(`Search type: ${searchType.value}`);
  fetch(`http://localhost:3003/pcbinv/editChangeLog?search=${searchTerm.value}&searchtype=${searchType.value}&changetype=${changetype.value}`)
    .then((response) => response.json())
    .then((data) => dataInit(data.data))
    .catch(function() {
      console.log("Error occurred");
    });
}
// Makes an initial API query to gather all components when the page is first ran
dataFetch();

// Updates global variables when a new search is made
function dataInit(data) {
    console.log(data);
    globalData = data;
    numResults = globalData.length;
    page = 1;
    startResult = 0;
    pageChange(0);
}


function pageChange(incrementValue) {
  page += incrementValue;
  startResult = (page - 1) * 10;
  if ((startResult + 10) >= numResults) {
    endResult = numResults;
    // Case for the number of results being less than or equal to 10
    if (numResults <= 10) {
      pageSelectInfo.innerHTML = `Showing all results`;
      // Removes page select buttons from view to avoid values below 0 and above the number of results
      for (let i = 0; i < 2; i++) {
        if (!pageButtons[i].classList.contains("hidden")) {
          pageButtons[i].classList.add("hidden");
        }
      }
    } else {
      // Case for last page of results from a query returning more than 10 results
      pageSelectInfo.innerHTML = `Showing results ${startResult + 1} - ${numResults} of ${numResults}`;
      if (pageButtons[0].classList.contains("hidden")) {
        pageButtons[0].classList.remove("hidden");
      }
      if (!pageButtons[1].classList.contains("hidden")) {
        pageButtons[1].classList.add("hidden");
      }
    }
  // Case for displaying a set of 10 results that can all be displayed at once
  // Ex. Showing results 41-50 of 60
  } else {
    endResult = startResult + 10;
    pageSelectInfo.innerHTML = `Showing results ${startResult + 1} - ${endResult} of ${numResults}`;
    // Removes left button from view and ensures the right button is in view on page 1
    if (page == 1) {
      if (!pageButtons[0].classList.contains("hidden")) {
        pageButtons[0].classList.add("hidden");
      }
      if (pageButtons[1].classList.contains("hidden")) {
        pageButtons[1].classList.remove("hidden");
      }
    } else {
      if (pageButtons[0].classList.contains("hidden")) {
        pageButtons[0].classList.remove("hidden");
      }
      if (pageButtons[1].classList.contains("hidden")) {
        pageButtons[1].classList.remove("hidden");
      }
    }
  }
  updateTable(startResult, endResult);
}

function updateTable(startResult, endResult) {
  // i refers to the index of gathered data entries (each log entry)
  let i = startResult;
  // j refers to the row in the page
  let j = 0;
    for (i; i < endResult; i++) {
      let rowData = rowArray[j].getElementsByClassName("part-data");
      if (rowArray[j].classList.contains("hidden")) {
        rowArray[j].classList.remove("hidden");
      }
      rowData[0].innerHTML = globalData[i].libref;
      rowData[1].innerHTML = globalData[i].changetype;
      rowData[2].innerHTML = globalData[i].oldvalue;
      rowData[3].innerHTML = globalData[i].newvalue;
      rowData[4].innerHTML = globalData[i].date;
      j++;
    }
    for (j; j < 10; j++) {
        if (!rowArray[j].classList.contains("hidden")) {
            rowArray[j].classList.add("hidden");
        }
    }
}


function undo(index) {
  if (confirm(`You sure you wanna undo this change to ${librefs[index].innerHTML}?`)) {
    console.log("Confirmed undo mothafucka");
    let date = new Date();
    let dateString = date.toString();
    let undoType;
    let rowData = rowArray[index].getElementsByClassName("part-data");
    //console.log(rowData[1].innerHTML);
    if (rowData[1].innerHTML == "Delete") {
        undoType = "Add";
    } else if (rowData[1].innerHTML == "Add") {
        undoType = "Delete";
    } else {
        undoType = "Update";
    }
    let dataEntry = globalData[(10 * (page - 1)) + index];
    fetch(`http://localhost:3003/pcbinv/editChangeLog`, {
      method: "POST",
      body: JSON.stringify({
        libref: librefs[index].innerHTML,
        type: undoType,
        oldvalue: dataEntry.oldvalue,
        newvalue: dataEntry.newvalue,
        date: dateString.slice(0, 25),
        letter: dataEntry.letter,
        package: dataEntry.package,
        value: dataEntry.value,
        valueunits: dataEntry.valueunits,
        description: dataEntry.description,
        comment: dataEntry.comment,
        reservequant: dataEntry.reservequant,
        orderquant: dataEntry.orderquant
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

  }
}


