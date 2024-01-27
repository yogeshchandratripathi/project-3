const table = document.getElementById("data_table");
const searchBaar = document.getElementById("search");
const sortByCap = document.getElementById("cap");
const sortByPercent = document.getElementById("percentage");

let data = [];//Initializing data array.

// fetching data when document loaded.
document.addEventListener("DOMContentLoaded", () => {
  fetchData()
    .then(() => showCurrentData(data))
    .catch((e) => console.log(e));
});

// async function for fetching data.
async function fetchData() {
  try {
    const jsonData = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false`
    );
    data = await jsonData.json();
  } catch (error) {
    console.log(error);
  }
}


// function to show data on UI. 
function showCurrentData(newData) {
  table.innerHTML= "";
  newData.map((item) => {
    table.innerHTML += `
    <tr>
        <td>
            <img src="${item.image}" alt="${item.name}">${item.name}
        </td>
        <td>${item.symbol.toUpperCase()}</td>
        <td>$${item.current_price}</td>
        <td>$${item.fully_diluted_valuation.toLocaleString()}</td>
        <td style="color:${
          item.market_cap_change_percentage_24h >= 0 ? "rgb(8, 248, 8)" : "red"
        };">${item.market_cap_change_percentage_24h.toFixed(2)}%</td>
        <td>Mkt Cap : $${item.market_cap.toLocaleString()}</td>
    </tr>
    `;
  });
}


// Function to filter data according to tha search query.
searchBaar.addEventListener("input", (e) => {
  let name = e.target.value.trim().toLowerCase();
  let symbol = e.target.value.trim().toLowerCase();
  sortByCap.value = "";
  sortByPercent.value = "";
  debouncing(300, name, symbol);
});

// Created deboucing function to reduce api call when spamming.
let timeout;
function debouncing(delay, name, symbol) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log(name, symbol);
    showSearchData(name, symbol);
  }, delay);
}

// showSearchData function for fehting t
function showSearchData(name, symbol) {
  fetchData()
    .then(() => {
      data = data.filter((item) => {
        return (
          item.name.toLowerCase().includes(name) ||
          item.symbol.toLowerCase().includes(symbol)
        );
      });
      showCurrentData(data);
    })
    .catch((error) => console.log(error));
}

// sortByCap function to sort data by Mkt cap.
sortByCap.addEventListener("change", (e) => {
  sortByPercent.value = "";
  if (e.target.value === "LowToHigh") {
    data.sort((a, b) => a.market_cap - b.market_cap);
  } else if (e.target.value === "HighToLow") {
    data.sort((a, b) => b.market_cap - a.market_cap);
  }
  showCurrentData(data);
});

// sortByPercent function to sort data by percentage.
sortByPercent.addEventListener("change", (e) => {
  sortByCap.value = "";
  if (e.target.value === "LowToHigh") {
    data.sort(
      (a, b) =>
        a.market_cap_change_percentage_24h - b.market_cap_change_percentage_24h
    );
  } else if (e.target.value === "HighToLow") {
    data.sort(
      (a, b) =>
        b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h
    );
  }
  showCurrentData(data);
});