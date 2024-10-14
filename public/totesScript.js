// Defines constants that refer to HTML page elements
const partTable = document.getElementById("parts-table");
const rowArray = document.getElementsByClassName("part-row");
const pageSelectInfo = document.getElementById("page-select-information");
const toteNames = document.getElementsByClassName("tote-name");
const viewButtons = document.getElementsByClassName("view-button");

const searchType = document.getElementById("part-search-option");
const searchTerm = document.getElementById("tote-search");



// Remove saved data from sessionStorage
//sessionStorage.removeItem("key");

// Remove all saved data from sessionStorage
//sessionStorage.clear();

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
  // TODO: add search queries
  fetch(`http://localhost:3003/packinv/totes?searchType=${searchType.value}&searchTerm=${searchTerm.value}`)
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
      rowData[0].innerHTML = globalData[i].name;
      rowData[1].innerHTML = globalData[i].description;
      j++;
    }
    for (j; j < 10; j++) {
        if (!rowArray[j].classList.contains("hidden")) {
            rowArray[j].classList.add("hidden");
        }
    }
}

function viewBoard(index) {
    sessionStorage.setItem("totename", toteNames[index].innerHTML);
}


function deleteBoard(index) {
  if (confirm(`You sure you wanna delete tote ${toteNames[index].innerHTML} and its contents?`)) {
    fetch(`http://localhost:3003/packinv/deleteTote`, {
      method: "POST",
      body: JSON.stringify({
        totename: toteNames[index].innerHTML
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }
  location.href = "/totes";
  
}
