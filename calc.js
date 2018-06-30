

if (!('indexedDB' in window)) {
	console.log('This browser doesn\'t support IndexedDB');
}

var dbPromise = idb.open('currency-rates', 4, function(upgradeDb) {
  console.log('making a new object store');
  if (!upgradeDb.objectStoreNames.contains('rates')) {
    upgradeDb.createObjectStore('rates');
  }
});

// Read the data from the database
dbPromise.then(function(db) {
  var tx = db.transaction('currency-rates');
  var store = tx.objectStore('currency-rates');

  const data = store.get(key);
  return data;
})
.catch(err => {
  console.log('Fetch error: -S', error);
});

//Add data to the database
dbPromise.then(function(db) {
  var tx = db.transaction('currency-rates', 'readwrite');
  var store = tx.objectStore('currency-rates');
  store.add(arrayOfCurrencies, key);
});

dbPromise.then(function(db) {
  var tx = db.transaction('currency-rates', 'readwrite');
  var store = tx.objectStore('currency-rates');
  currencies.forEach(currency => store.put(currency, key));
});

arrayOfCurrencies.map(currency => {
      frmCurrency.appendChild(createNode(nodeTypeToCreate, currency));
      toCurrency.appendChild(createNode(nodeTypeToCreate, currency));
  });
  

//Get list of currencies to the DOM
const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
const rateUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
let query = `${frmCurrency}_${toCurrency}`;
let inputCurrency = document.getElementById('amount');
let outputCurrency = document.getElementById('output');
amt = document.getElementById('amount').value;

fetch(url)
  .then(
    response => {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
        return;
      }
      response.json().then(results => {
        let currencySelect;
      let i;
      currencySelect = document.querySelectorAll('.currencyChange');
    
      for (i = 0; i < currencySelect.length; i++) {
      currencySelect[i].length = 0;
      let defaultCurrency = document.createElement('option');
      defaultCurrency.text = 'Select a Currency';
      currencySelect[i].add(defaultCurrency);
      currencySelect[i].selectedIndex = 0;
        let option;
        for (const result in results) {
          for (const id in results[result]) {
          
          let data = results[result][id]['id'];
          
          option = document.createElement('option');
          option.text = data;
           currencySelect[i].add(option)
           }
          }
        }

      });
    }
  )
  .catch(err => {
    console.log('Fetch Error :-S', err);
  });

 //Calculate exchange rate 

document.getElementById('convert').onclick = calculateAmt;

function calculateAmt() {

  let frmCurrency = document.getElementById('currencyFrm').value;
  
  let toCurrency = document.getElementById('currencyTo').value;

  fetch(rateUrl)
  .then(
    response => {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
        return;
      }

      // Examine the text in the response
      response.json().then(data => {
        console.log(data);

        for (query in data) {
            if (data.hasOwnProperty(query)) {
              let exchangeRate = data[query];
              let total = amt * exchangeRate;
              let currConv = Math.round(total * 100) / 100;
              console.log(currConv);
              document.getElementById('output').value = currConv;
            }
            }
      });
    }
  )
  .catch(err =>  {
    console.log('Fetch Error :-S', err);
  });
}

function exchangeRate() {
    const url = rateUrl;
    return url;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const exchangeRateAmt = Object.values(data);

        calculateExchangeRate(...exchangeRateAmt, amt);
      })
      .catch(err => {
        console.log('Fetch Error :-S', err);
      })
  }

  function calculateExchangeRate(exchangeRateAmt, amt) {

    const rateCurrency = amt * exchangeRateAmt;
    inputCurrency.value = amt;
    outputCurrency.value = rateCurrency;
  }

  function keyPressedEvent(event) {
  if (event.keyCode === 13) {
    exchangeRate();
    }
  }
















