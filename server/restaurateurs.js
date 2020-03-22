const axios = require('axios');
const cheerio = require('cheerio');
const querystring= require ('querystring');

const maitres=[];
/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
*/ 

const parse = data => {
  const $ = cheerio.load(data);
  const name = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-content-infos.row > div.ep-infos-txt > div.infos-nom').text();
  const proprio = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-content-infos.row > div.ep-infos-txt').text();
  const adress = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-content-infos.row > div.ep-infos-txt > div.infos-complement > a').attr('href');
  const site = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5 > a').text();
  const mail =$('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5 > div > a').text();
  const tel =$('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5').text();
  var restaurant = {'name': name,
                  'adresse': adress,
                  'gérant':proprio,
                  'adresse':adress,
                  'siteWEB':site,
                  'telephone':tel,
                  'contact':mail};
  return restaurant;
  
};
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
async function getInfoRestaurant(profils) {
  for (int in profils)
  {

      const rest = await getInfoOneRestaurant('https://www.maitresrestaurateurs.fr'+profils[int]);
      console.log(rest);

  } 
};

//'request_id' : 'af6c29f98c729a0ca26f488dc550f73a'};
//scrapePage('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult');

url_search = 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult';
async function scrapePage(urlS) {
  /*
  var DATA= new FormData();
  DATA.append("page",1);
  DATA.append("request_id","9ebf002bbd8d0c6848ba156aa38eb26f");
  DATA.append("sort","undefined");
  console.log(DATA);

  const option={
      url: urlS ,
      method: "post",
      data: DATA,
    };*/
  
  const response = await axios.post(urlS,querystring.stringify({
    page: 1,
    sort: 'undefined',
    request_id: '9ebf002bbd8d0c6848ba156aa38eb26f'
  }));
  const {data, status,error} = response;

  if (status >= 200 && status < 300 && !error) {
    const $ = cheerio.load(data);
 
    const profils= $('body > div.col-md-9 > div.annuaire_result_list > div > div.single_desc > div.single_libel > a').get().map(x => $(x).attr('href'));
    console.log(profils);
    return profils;
  }
  else {
    console.log(error);
  }
};

async function get(urL){
  const profils =await  scrapePage(urL);
  console.log(profils);
  getInfoRestaurant(profils);
};
get(url_search);


/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
/*
module.exports.get = () => {
  return [];
};*/
