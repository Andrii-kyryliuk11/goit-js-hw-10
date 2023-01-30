import Notiflix from 'notiflix';
import './css/styles.css';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));
function addListenerToLinks() {
  links = document.querySelectorAll('.link').forEach(item => {
    item.addEventListener('click', onLinkClick);
  });
}

function onLinkClick(e) {
  e.preventDefault();
  const link = e.target.href;
  processingPromises(fetch(link));
}

function getCountriesList(name) {
  processingPromises(
    fetch(
      `https://restcountries.com/v3.1/name/${name}?&fields=name,capital,population,flags,languages`
    )
  );
}

function onFormInput(e) {
  if (e.target.value !== '') {
    getCountriesList(e.target.value);
  }
  clearList();
}

function createCountryList(response) {
  const markup = [];
  response.map(country => {
    markup.push(
      `<li class= country-list__item><a class= link href="https://restcountries.com/v3.1/name/${country.name.common}?&fields=name,capital,population,flags,languages"><img src= '${country.flags.svg}' alt="${country.name.common} flag">${country.name.common}</a></li>`
    );
  });

  refs.countryList.innerHTML = markup.join('');

  addListenerToLinks();
}

function clearList() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
function createCountryCard(response) {
  const country = response[0];

  const markup = `<li class= country-info__item><img src= '${
    country.flags.svg
  }' alt="${country.name.official}flag" width='32' height= '20'>${
    country.name.common
  }</li> <li class= country-info__item><span>Capital:</span>${
    country.capital
  }</li> <li class= country-info__item><span>Population:</span>${
    country.population
  }</li> <li class= country-info__item><span>Languages:</span>${Object.values(
    country.languages
  )}</li>`;
  refs.countryInfo.innerHTML = markup;
}

function processingPromises(response) {
  response
    .then(response => response.json())
    .then(response => {
      
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
      } else if (response.length >= 2 && response.length < 10) {
        clearList();
        createCountryList(response);
        return;
      } else if ((response.length = 1)) {
        clearList();
        createCountryCard(response);
      }
    })
    .catch(error => console.log(error));
}
