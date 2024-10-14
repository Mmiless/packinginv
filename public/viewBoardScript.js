
let boardname = sessionStorage.getItem("boardname");
console.log(boardname);

// Defines constants that refer to HTML page elements
const partTable = document.getElementById("parts-table");
const rowArray = document.getElementsByClassName("part-row");
const pageSelectInfo = document.getElementById("page-select-information");
const librefs = document.getElementsByClassName("libref");
const searchTerm = document.getElementById("part-search");
const searchType = document.getElementById("part-search-option");
// Refers to the select buttons at the bottom of the page. [0] refers to left button, [1] refers to right button
const pageButtons = document.getElementsByClassName("page-select-button");
// Defines global variables used in multiple functions
let page;
let numResults;
let startResult;
let endResult;
let globalData;
let currentQuants = [];
// fetch(`http://localhost:3000/pcbinvparts?search=${searchTerm.value}&type=${searchType.value}&letter=${letter.value}&qu
// Handles making an API query when a search is made

const pageTitle = document.getElementById("board-name-title");
pageTitle.innerHTML = boardname;

function dataFetch() {
  console.log(searchTerm.value);
  fetch(`http://localhost:3003/pcbinv/getBoard?board=${boardname}&search=${searchTerm.value}&searchType=${searchType.value}&status=Any`)
    .then((response) => response.json())
    /* The result contains metadata in the response, which is not necessary for the webpage 
    data.data refers to the list of components within the API result to make things easier */
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
  let i = startResult;
  let j = 0;
    for (i; i < endResult; i++) {
      let rowData = rowArray[j].getElementsByClassName("part-data");
      if (rowArray[j].classList.contains("hidden")) {
        rowArray[j].classList.remove("hidden");
      }
      rowData[0].innerHTML = globalData[i].libref;
      rowData[1].innerHTML = globalData[i].designator;
      rowData[2].innerHTML = globalData[i].footprint;
      rowData[3].innerHTML = globalData[i].description;
      rowData[4].innerHTML = globalData[i].quantity;
      rowData[5].innerHTML = globalData[i].comment;
      rowData[6].innerHTML = globalData[i].supplierpartnumber;
      rowData[7].innerHTML = globalData[i].supplier;
      j++;
    }
    for (j; j < 10; j++) {
        if (!rowArray[j].classList.contains("hidden")) {
            rowArray[j].classList.add("hidden");
        }
    }
}

function createLayupBoard() {
    let layupItemArray = [];
    globalData.forEach(item => {
        let newItem = []; 
        let libref = item.libref;
        let designator = item.designator.split(",");
        let footprint = item.footprint;
        let description = item.description;
        let comment = item.comment;

        designator.forEach(item => {
            layupItemArray.push([libref, item.trim(), footprint, description, comment, 0]);
        });
    });
    console.log(layupItemArray);
    let date = new Date();
    let dateString = date.toString().slice(0, 25);

    fetch(`http://localhost:3003/pcbinv/getBoard`, {
        method: "POST",
        body: JSON.stringify({
        boardname: boardname,
        date: dateString,
        itemArray: layupItemArray
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    })
    alert("Layup board has been created");
}