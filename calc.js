

if (!('indexedDB' in window)) {
	console.log('This browser doesn\'t support IndexedDB');
}

var dbPromise = idb.open('currencies', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('currency-rates');
      break;
    default:
      console.log('Error creating database');
      break;
  }
});

class idbDatabase {
 static getCurrencies(key) {
    return dbPromise
      .then(db => {
        if (!db) return;
        var tx = db.transaction('currency-rates');
        var store = tx.objectStore('currency-rates');

        var currData = store.get(key);
        return currData;
      })
      .catch(err => {
        console.log('Fecth error : -S', err);
      });
  }

  static currencyArray(key, currencyArray) {
    return dbPromise
      .then(db => {
        const tx = db.transaction('currency-rates', 'readwrite');
        const store = tx.objectStore('currency-rates');

        store.put(currencyArray, key);
        return tx.complete;
      })
      .catch(err => {
        console.log('Fecth error : -S', err);
      });
  }

  static currencyData(key, currencies) {
    return dbPromise
      .then(db => {
        const tx = db.transaction('currency-rates', 'readwrite');
        const store = tx.objectStore('currency-rates');

        currencies.forEach(currency => store.put(currency, key));
        return tx.complete;
      })
      .catch(err => {
        console.log('Fecth error : -S', err);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  var body = document.querySelector('body');
  var currencyFrm = document.querySelector('.currencyChangeFrm');
  var currencyTo = document.querySelector('.currencyChangeTo');
  var button = document.querySelector('.convert');
  const currencyInput = document.querySelector(
    'input#original_amount',
  );
  const currencyOutput = document.querySelector(
    'input#converted_amount',
  );

  function createNode(nodeType, currency) {
    if (arguments.length !== 2) {
      console.log(
        'Enter both arguments.',
      );
    }

    const node = document.createElement(nodeType);
    node.innerText = currency;

    return node;
  }

  function populateCurrencies(currencyArray) {
    if (
      currencyArray.length === 0 ||
      typeof currencyArray === 'undefined'
    ) {
      console.log('Array is empty.');
    }

    var createCurrNode = 'option';

    currencyArray.map(currency => {
      currencyFrm.appendChild(createNode(createCurrNode, currency));
      currencyTo.appendChild(createNode(createCurrNode, currency));
    });
  }

  function getInputAmount() {
    const inputAmount = document.querySelector('input#amount').value;
    return inputAmount;
  }

  
  function getListOfCurrencies() {
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

    fetch(url, {
      cache: 'default',
    })
      .then(res => res.json())
      .then(data => {
        const currencyArray = Object.keys(data.results).sort();

        
        idbDatabase.currencyArray('allCurrencies', currencyArray);

        populateCurrencies(currencyArray);
      })
      .catch(err => {
          console.error(
          `This error has occured. ${err}`,
        );
      
        idbDatabase.getCurrencies('allCurrencies').then(currencyArray => {
          if (typeof currencyArray === 'undefined') return;
          populateCurrencies(currencyArray);
        });
      });
  }

  
  function getCurrencyRate(url, query) {
    if (arguments.length !== 2) {
      console.log(
        'Enter both currencies for their exchange rate.',
      );
    }

    const inputAmount = getInputAmount();

    fetch(url, {
      cache: 'default',
    })
      .then(res => res.json())
      .then(data => {
        const exchangeRate = Object.values(data);

        idbDatabase.currencyData(query, exchangeRate);

        resolveExchangeRate(...exchangeRate, inputAmount);
      })
      .catch(err => {
        console.error(
          `This error has occured. ${err}`,
        );
        idbDatabase.getCurrencies(query).then(data => {
          if (typeof data === 'undefined') return;
          resolveExchangeRate(data, inputAmount);
        });
      });
  }


  function getAPIUrl(query) {
    if (typeof query === 'undefined') {
      console.log('Enter a URL.');
    }

    const currencyUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
    return currencyUrl;
  }


  function fetchExchangeRate() {
    const currFrm = document.querySelector('.currencyChangeFrm').value;
    const currTo = document.querySelector('.currencyChangeTo').value;
    const currencyQuery = `${currFrm}_${currTo}`;
    const url = getAPIUrl(currencyQuery);

    getCurrencyRate(url, currencyQuery);
  }


  function btnEnterPressed(event) {
    if (typeof event === 'undefined') {
      console.log(
        "Hit the enter key.",
      );
    }

    if (event.keyCode === 13) {
      fetchExchangeRate();
    }
  }

  
  function resolveExchangeRate(exchangeRate, input) {
    if (arguments.length !== 2) {
      console.log(
        'Enter two values.',
      );
    }

    const exchangedCurrency = input * exchangeRate;

    currencyInput.value = input;
    currencyOutput.value = exchangedCurrency.toFixed(2);
  }

  function addEventListeners() {
    button.addEventListener('click', fetchExchangeRate);
    body.addEventListener('keydown', e => btnEnterPressed(e));
  }


  function init() {
    addEventListeners();
    getListOfCurrencies();
  }

  init();
});
















