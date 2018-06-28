import idb from 'idb'

document.getElementById('convert').onclick = calculateAmt;

function calculateAmt() {

	let frmCurrency = document.getElementById('currencyFrm').value;
	
	let toCurrency = document.getElementById('currencyTo').value;
	
	let query = frmCurrency+'_'+toCurrency;
	
	amt = document.getElementById('amount').value;

	fetch('https://free.currencyconverterapi.com/api/v5/convert?q='+query+'&compact=ultra')
  .then(
    response => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
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