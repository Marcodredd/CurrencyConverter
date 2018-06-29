

if (!('indexedDB' in window)) {
	console.log('This browser doesn\'t support IndexedDB');
}


const apiURL = `https://free.currencyconverterapi.com/api/v5/countries`;   
let countriesCurrencies;
var dbPromise = idb.open('countries-currencies', 0, upgradeDB => {
  // Note: we don't use 'break' in this switch statement,
  // the fall-through behaviour is what we want.
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('objs', {keyPath: 'id'});
  }
});
fetch(apiURL)
  .then(function(response) {
  return response.json();
})
  .then(function(currencies) {
  dbPromise.then(db => {
    if(!db) return;
    countriesCurrencies = [currencies.results];
    const tx = db.transaction('objs', 'readwrite');
    const store = tx.objectStore('objs');
    let i = 0;
    countriesCurrencies.forEach(function(currency) {
      for (let value in currency) {
        store.put(currency[value]);
      }
    });
    return tx.complete;
  });
});
	

fetch('https://free.currencyconverterapi.com/api/v5/countries')
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
      		
      		let data = results[result][id]['currencyId'];

          function unigueData = (value, index, self) {
            return self.indexOf(value) === index;
          }

          let unique = data.filter(unigueData);
          unique.sort();
          
      		option = document.createElement('option');
      		option.text = unique;
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