const axios = require('axios');
const cheerio = require('cheerio');

const bibs= []
const restaurant = {'name':' ', 'adresse':' '}

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

const parse = data => {
  const $ = cheerio.load(data);

  const name = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > h2').text();
  const adresse = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text();

  const restaurant = {'name': name, 'adresse': adresse}
  console.log(name,adresse,restaurant);
};
  

/**
 * Scrape a given restaurant url
 * @param  {String}  urL
 */

async function getInfoRestaurant(urL) {
  const option={
    méthode: "get",
    url: urL,
    timeout:5000,
  };

  const response = await axios(option);
  const {data, status,error} = response;

  if (status >= 200 && status < 300) {
    console.log(parse(data));
    console.log( parse(data));
  }
  else{
    console.log(error)  
  }
};

console.log(getInfoRestaurant("https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/etsi"))

/**
 * Scrape a website page given a URL
 * @param  {String}  urL
 */
async function getDataPerPage(urL) {
  const option={
    méthode: "get",
    url: urL,
    timeout:5000,
  };
  
  const response = await axios(option);
  const {data, status,error} = response;
  const URLS=[];

  if (status >= 200 && status < 300) {
    const $ = cheerio.load(data);
    //récuperer nombre total de restaurants echec 
    //const nombreR = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.search-results__count > div.d-none.d-lg-block.filter-bar__selected.js-restaurant__selected_filters > a').text();
    const tableau = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items');

    /*tableau.each(function(i,element){
      URLS[i]=$(this,'div > a').data('href').text()
    });*/

    const test= $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items > div:nth-child(1) > div').data();

    const test2= $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items > div > div > a').get().map(x => $(x).attr('href'));

    console.log(test2);
    console.log("lu");
    //return(data)
  }

  
  else{
    console.log(error)  
  }
  //return URLS;
};

const tableau = getDataPerPage('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/2');


/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
const URL = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand#';

module.exports.get = () => {
  return [];
};
