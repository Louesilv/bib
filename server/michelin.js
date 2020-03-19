const axios = require('axios');
const cheerio = require('cheerio');



/**
 * Get information about one restaurant 
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

const parse = data => {
  const $ = cheerio.load(data);

  var name = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > h2').text();
  var adresse = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text();

  var restaurant = {'name': name, 'adresse': adresse}
  console.log(restaurant);
};
  

/**
 * Scrape a given restaurant url
 * @param  {String}  urL
 * @return {Object} restaurant
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
    
    const rest = await parse(data);
    return rest;
  }
  else{
    console.log(error)  
  }
  return null;
};

//console.log(getInfoRestaurant("https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/etsi"))

/**
 * Scrape a website page given a URL
 * We obtain all the urls of restaurants 
 * @param  {String}  urL
 * @return {Object} URLS
 */
async function getDataPerPage(urL) {

  const option={
    méthode: "get",
    url: urL,
    timeout:5000,
  };
  
  const response = await axios(option);
  const {data, status,error} = response;

  if (status >= 200 && status < 300 && !error ) {
    const $ = cheerio.load(data);
    //récuperer nombre total de restaurants echec 
    //const nombreR = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.search-results__count > div.d-none.d-lg-block.filter-bar__selected.js-restaurant__selected_filters > a').text();
    
    /*TEST 
    const tableau = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items');

    tableau.each(function(i,element){
      URLS[i]=$(this,'div > a').data('href').text()
    });
    
    const test= $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items > div:nth-child(1) > div').data();
    */
  
    const URLS= await $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items > div > div > a').get().map(x => $(x).attr('href'));
  }

  else{
    console.log(error);
  }
  return null;
};

/*
var tab =[];
let myF = function(tab){
  getDataPerPage("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand#").then(value=> {tab=value});}
console.log(myF(tab));*/

console.log(getDataPerPage("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand#"));
/**
 * Get all the info about restaurant for a given page (array with all the url for a page ) 
 * @param  {Array} bibs // previous restaurant
 * @param  {Object} URLS
 * @return {Array} bibs //array with previous restaurant and restaurant from the current page 
 */
function getInfoRestaurantPage(bibs,URLS) {
  for (url in URLS)
  {
    console.log(url);
    const rest = getInfoRestaurant('https://guide.michelin.com'+url)
    console.log(res);
    bibs.push(rest)
  } 
  return bibs;
};

//const bibs =getInfoRestaurantPage([]);
//console.log(bibs);

 async function getURL(urL){

  var URL=[]
  var compt = 1
  while(compt<16)
  {
    var option={
      méthode: "get",
      url: urL+ compt.toString(),
      timeout:5000,
    };
    console.log(option.url);

    const response = await axios(option);
    const {data, status,error} = response;

    if (status >= 200 && status < 300 && !error ) {
      const $ = cheerio.load(data);
      
      //All bib per page  
      const tableau = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items');

      /*
      tableau.each(element =>{
        console.log($(element,'div > a').data('href'))
      });
      */
      var URLS= await $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items > div > div > a').get().map(x => $(x).attr('href'));
      for (url in URLS)
      {
        URL.push(URLS[url]);
      }
    }
    else{
      console.log(error);
    }
    compt+=1;
  }
  return URL;
}

URL = getURL("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/");
console.log(URL);
/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
/*
module.exports.get = () => {
  return [];
};*/
