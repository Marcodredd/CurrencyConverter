

if (!('indexedDB' in window)) {
	console.log('This browser doesn\'t support IndexedDB');
}

var dbPromise = idb.open('currency-rates', 4, function(upgradeDb) {
  console.log('making a new object store');
  if (!upgradeDb.objectStoreNames.contains('rates')) {
    upgradeDb.createObjectStore('rates', {keyPath: 'id'});
  }
});

dbPromise.then(function(db) {
  var tx = db.transaction('currency-rates', 'readwrite');
  var currencyStore = tx.objectStore('currency-rates');

  fetch('https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP,PHP_USD')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {

      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  currencyStore.add(data);
  return tx.complete;
});



	

fetch('https://free.currencyconverterapi.com/api/v5/currencies')
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

document.getElementById('convert').onclick = calculateAmt;

function calculateAmt() {

	let frmCurrency = document.getElementById('currencyFrm').value;
	
	let toCurrency = document.getElementById('currencyTo').value;
	
	let query = `${frmCurrency}_${toCurrency}`;
	
	amt = document.getElementById('amount').value;

	fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
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