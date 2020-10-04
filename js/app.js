// Variables
const form = document.querySelector('#cotizar-seguro');

// Constructores
function Insurance(brand, year, type) {
    this.brand = brand;
    this.year = year;
    this.type = type;
}

// Make the quote with the data
Insurance.prototype.quoteInsurance = function() {
    /*
    1 = Americano 1.15
    2 = Asiatico 1.05
    3 = Europeo 1.35
    */
    // console.log(this.brand);

    let quantity;
    const base = 2000;

   switch(this.brand) {
        case '1':
            quantity = base * 1.15;
            break;
        case '2':
            quantity = base * 1.05;
            break;
        case '3':
            quantity = base * 1.35;
            break;
        default:
            break;
    
   }
   // Read the year
   const difference = new Date().getFullYear() - this.year;

   // Every year that the difference is greater the cost will be reduced by 3%
   quantity -= ((difference*3)*quantity)/100;

   /*
   If the insurance is basic, it is multiplied by 30% more
   If the insurance is complete, it is multiplied by 50% more
   */

   if(this.type === 'basico'){
       quantity *= 1.30;
   } else {
       quantity *= 1.50;
   }

//    console.log(quantity); Test
   return Math.round(quantity);
}

function UI() {}

// Fill the options of the years
UI.prototype.fillOptions = () => {
    const max = new Date().getFullYear(),
          min = max - 20;

    const selectYear = document.querySelector('#year');

    for( let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// Displays alerts on screen
UI.prototype.showMessage = (message, type) => {

    const div = document.createElement('div');

    if(type === 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje','mt-10');
    div.textContent = message;
    
    // Insert in HTML
    form.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(()=>{
        div.remove();
    },3000);
}

UI.prototype.showResult = (total, insurance) => {

    const { brand, year, type } = insurance;
    let txtBrand;

    switch(brand){
        case '1':
            txtBrand = 'Americano';
            break;
        case '2':
            txtBrand = 'Asiatico';
            break;
        case '3':
            txtBrand = 'Europeo';
            break;
        default:
            break;
    }

    // Create result
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${txtBrand}</span> </p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span> </p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${type}</span> </p>
        <p class="font-bold">Total: <span class="font-normal"> $ ${total}</span> </p>
    `;

    const resultDiv = document.querySelector('#resultado');
    
    // Show spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none'; // Hidden spinner
        resultDiv.appendChild(div); // Show result
    },3000); 
}

// Instance
const ui = new UI();
// console.log(ui); Test

document.addEventListener('DOMContentLoaded', () => {
    // Fill select with the years
    ui.fillOptions(); 
})

eventListeners();
function eventListeners() {
    
    form.addEventListener('submit', quoteInsurance);
} 

function quoteInsurance(e) {
    e.preventDefault();

    // Read the selected brand
    const brand = document.querySelector('#marca').value;
    // console.log(brand); Test

    // Read the selected year
    const year = document.querySelector('#year').value;
    // console.log(year); Test
   
    // Read the type of coverage
    const type = document.querySelector('input[name="tipo"]:checked').value;
    // console.log(type); Test

    if(brand === '' || year === '' || type === '') {
        ui.showMessage('Todos los campos son obligatorios','error');
        return;
    } 
    ui.showMessage('Cotizando...','success');
    // console.log('cotizando...'); Test

    // Hide previous quotes
    const results = document.querySelector('#resultado div');
    if(results != null) {
        results.remove();
    }

    // Instance insurance
    const insurance = new Insurance(brand, year, type);
    // console.log(insurance); Test
    const total = insurance.quoteInsurance();

    // Use the prototype ti be quoted
    ui.showResult(total, insurance);

}