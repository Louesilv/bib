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

  var restaurant = {'name': name, 'adresse': adresse};
  //console.log(restaurant);
  return restaurant;


};
  

/**
 * Scrape a given restaurant url
 * @param  {String}  urL
 * @return {Object} restaurant
 */

async function getInfoOneRestaurant(urL) {
  const option={
    méthode: "get",
    url: urL,
    timeout:5000,
  };

  const response = await axios(option);
  const {data, status,error} = response;

  if (status >= 200 && status < 300) {

    const rest = await parse(data);
    //console.log(rest);
    return rest;
  }
  else{
    console.log(error)  
  }
  return null;
};

/*TEST 
const promiseTest=getInfoOneRestaurant("https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/etsi");
R=promiseTest.then(value =>{return value;});
console.log(R);*/

async function getInfoRestaurant(URLS) {
  const bibs=[];
  for (url in URLS)
  {
    //console.log(URLS[url]);
    if(URLS[url]!= "/fr/fr/subscribe")
      {
        const rest = await getInfoOneRestaurant('https://guide.michelin.com'+URLS[url]);
        bibs.push(rest);
      }
  } 
  return bibs;
};

//const bibs =getInfoRestaurantPage([]);
//console.log(bibs);

async function getURL(urL){

  var URL=[]
  var compt = 1
  while(compt<3)
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
      /*  
      const tableau = $('body > main > section.section-main.search-results.search-listing-result > div > div > div.row.restaurant__list-row.js-toggle-result.js-geolocation.js-restaurant__list_items');
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

/*
p1 = getURL("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/");
URL =p1.then(value =>{return value;});
console.log(URL);


const p2 = getInfoRestaurant(URL);
bibs=p2.then(value =>{return value;});
console.log(bibs);
*/

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */

module.exports.get = async() => {
  
  var list_URL = await getURL("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/");
  var bibs = await getInfoRestaurant(list_URL);
  return bibs;
};

module.exports.get();
