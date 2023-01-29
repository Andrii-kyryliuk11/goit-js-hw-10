import Notiflix from 'notiflix';
import './css/styles.css';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onFormInput, 500));

function a(name) {
  fetch(
    `https://restcountries.com/v3.1/name/${name}?&fields=name,capital,population,flags,languages`
  )
    .then(response => response.json())
      .then(response => {
      console.log("🚀 ~ file: index.js:38 ~ a ~ response", response)
      if (response.status === 404) {
        clearList();
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      } else if (response.length > 10) {
        clearList();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (response.length > 2 && response.length < 10) {
        createCountryList(response);
        return;
      } else if (response.length = 1) {
          clearList()
           createCountryCard(response)
      }
       
    });
       
}

function onFormInput(e) {
  e.preventDefault();

  a(e.target.value);
}

function createCountryList(response) {
  const markup = [];
  response.map(country => {
    markup.push(
      `<li><img src= '${country.flags.svg}' alt="${country.name.official}flag" width='32' height= '20'>${country.name.common}</li>`
    );
  });

  refs.countryList.innerHTML = markup.join('');
}

function clearList() {
    refs.countryList.innerHTML = '';
     refs.countryInfo.innerHTML = ''
}
function createCountryCard(response) {
 const markup = []
   
    response.map(country => {
      
       markup.push(`<li><img src= '${country.flags.svg}' alt="${country.name.official}flag" width='32' height= '20'>${country.name.common}</li> <li>Capital:${
  country.capital
  }</li> <li>Population:${
  country.population
  }</li> <li>Languages:${Object.values(country.languages)}</li>`)
  })
    refs.countryInfo.innerHTML = markup
    console.log("🚀 ~ file: index.js:65 ~ createCountryCard ~ markup", markup.join(''))
}
