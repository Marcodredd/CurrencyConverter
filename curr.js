
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