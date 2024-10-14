// Defines constants that refer to HTML page elements
const names = document.getElementsByClassName("part-data name");
const nums = document.getElementsByClassName("part-data num");
const partTable = document.getElementById("parts-table");
const rowArray = document.getElementsByClassName("part-row");
const pageSelectInfo = document.getElementById("page-select-information");
const searchType = document.getElementById("part-search-option");
const searchTerm = document.getElementById("part-search");
const toteFilter = document.getElementById("tote-filter");

// Refers to the select buttons at the bottom of the page. [0] refers to left button, [1] refers to right button
const pageButtons = document.getElementsByClassName("page-select-button");

// Defines global variables used in multiple functions
let page;
let numResults;
let startResult;
let endResult;
let globalData;
let currentQuants = [];

// Defines map of tote ids to names
let toteMap = {};

async function fetchIds() {
  await fetch(`http://localhost:3003/packinv/items/get-tote-names`)
    .then((response) => response.json())
    .then((data) => {
      toteMap = data;
    })
    .catch(function() {
      console.log("Error while making tote-id map");
    })
}

// Handles making an API query when a search is made
async function dataFetch() {
   
   await fetchIds();

   // Get the selected tote ID
   const selectedID = toteFilter.value; 
   const searchTypeValue = searchType.value; 
   const searchTermValue = searchTerm.value; 
 
   // Construct the query parameters
   const params = new URLSearchParams();
 
   // Add the search parameters
   if (searchTypeValue && searchTermValue) {
     params.append('searchType', searchTypeValue);
     params.append('searchTerm', searchTermValue);
   }
 
   // Add the tote ID if it’s not "ALL"
   if (selectedID && selectedID !== "ALL") {
     params.append('tote_id', selectedID);
   }
 
   // Make the fetch request with the constructed query
   fetch(`http://localhost:3003/packinv/items?${params.toString()}`)
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
  let j = 0;
    for (let i = startResult; i < endResult; i++) {
      let rowData = rowArray[j].getElementsByClassName("part-data");
      if (rowArray[j].classList.contains("hidden")) {
        rowArray[j].classList.remove("hidden");
      }
      rowData[0].innerHTML = globalData[i].name;
      rowData[1].innerHTML = toteMap[globalData[i].tote_id]; // replace with tote name by making db query
      rowData[2].innerHTML = globalData[i].description;
      rowData[3].innerHTML = globalData[i].lab_location;
      rowData[4].innerHTML = globalData[i].num;
      j++;
    }
    for (j; j < 10; j++) {
        if (!rowArray[j].classList.contains("hidden")) {
            rowArray[j].classList.add("hidden");
        }
    }
}


function updateShopQuant(value, index) {
  fetch(`http://localhost:3003/packinv/updateVal`, {
      method: "POST",
      body: JSON.stringify({
        name: names[index].innerHTML,
        value: Number(value)
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
    location.reload();
}

function incrementQuant(index, value) {
  const num = Number(nums[index].innerHTML);
  if (num == 0 && value == -1) {
    nums[index].innerHTML = 0;
  } else {
    nums[index].innerHTML = num + value;
  }
  updateShopQuant(num + value, index);
}


function deleteItem(index) {
  if (confirm(`Are you sure you want to delete ${names[index].innerHTML}?`)) {
    let date = new Date();
    let dateString = date.toString();
    let dataEntry = globalData[(10 * (page - 1)) + index];
    fetch(`http://localhost:3003/packinv/deleteItem`, {
      method: "POST",
      body: JSON.stringify({
        name: names[index].innerHTML,
        type: "Delete",
        date: dateString.slice(0, 25),
        tote_id: dataEntry.tote_id,
        description: dataEntry.description,
        lab_location: dataEntry.lab_location,
        num: dataEntry.num
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

  }
  location.reload();
}

function restoreSelectedTote() {
  const selectedTote = localStorage.getItem("selectedTote");
  
  if (selectedTote) {
    const toteFilter = document.getElementById("tote-filter");
    toteFilter.value = selectedTote;
  }
}

document.addEventListener("DOMContentLoaded", restoreSelectedTote);
