const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

url_search= "https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/";
/**
 * Get information about one restaurant 
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  var name = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > h2').text();
  var adresse = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text().split(",");
  var tel=$('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(4) > div.row > div:nth-child(1) > div > div:nth-child(1) > div > div > span.flex-fill').text();
  var site =$('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(4) > div.row > div:nth-child(1) > div > div.collapse__block-item.link-item > a').attr("href");
  //var mail =$().text();
  
  var restaurant = {'name': name,
                  'adresse':{"street": adresse[0],"code":adresse[2],"city":adresse[1]},
                  'siteWEB':site,
                  'telephone':tel,
                  'mail':""};

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
    return rest;
  }
  else{
    console.log(error)  
  }
  return null;
};



async function getURL(urL,page){

  var option={
    méthode: "get",
    url: urL+ page.toString(),
    timeout:5000,
  };

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
    /*for (url in URLS)
    {
      URL.push(URLS[url]);
    }*/
    return URLS;
  }
  else{
    console.log(error);
  }


  return null;
}
async function GetAllURL(urL,liste){
  compt=1;
  while(compt<16){
    const urls =await getURL(urL,compt);
    console.log("PAGE: " + compt);
    for (int in urls)
      {
        if(urls[int]!= "/fr/fr/subscribe")
          {liste.push(urls[int])};      
      }
    compt+=1;
  }
  return liste;
};


async function GetAllInfoRestaurant(urls){
  var bib_gourmand=[];
  for (int in urls)
  {
    const rest = await getInfoOneRestaurant('https://guide.michelin.com'+urls[int]);
    console.log(int);
    //const json = JSON.stringify(rest);
    bib_gourmand.push(rest);
     
  } 
  return bib_gourmand;
};

async function Get(urL){
  var urls = await GetAllURL(urL,[]);
  var bib_gourmand = await GetAllInfoRestaurant(urls);

  const Bibjson = JSON.stringify(bib_gourmand);
  const File = fs.writeFile("./bib_gourmand.json",Bibjson,(err)=>{
    if(err){console.log(err);}
    console.log("Data written");}
  );
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */

module.exports.get = async(urL) => {
  
  var urls = await GetAllURL(urL,[]);
  var bib_gourmand = await GetAllInfoRestaurant(urls);

  const Bibjson = JSON.stringify(bib_gourmand);
  const File = fs.writeFile("./bib_gourmand.json",Bibjson,(err)=>{
    if(err){console.log(err);}
    console.log("Data written");}
  );
};

Get(url_search);
