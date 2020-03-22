const axios = require('axios');
const cheerio = require('cheerio');
const FormData=require('form-data');
const querystring= require ('querystring');
/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
*/ 

const parse = data => {
  const $ = cheerio.load(data);
  const test = $().get();
  console.log(test);
  //const test = $('.#zoneAnnuaire_layout > div.row.annuaire_result').data();
  //console.log($);
  //const name = $('#zoneAnnuaire_layout > div.row.annuaire_result > div.col-md-9 > div.annuaire_result_list > div.annuaire_single.row-31 > div.single_desc > div.single_libel > a').attr('href');
  
  //var adresses = $('#zoneAnnuaire_layout > div.row.annuaire_result > div.col-md-9 > div.annuaire_result_list > div> div.single_desc > div.single_details > div > div > div').get().map(x => $(x).text());

  //var restaurant = {'name': name, 'adresse': adresse}
  
};



//'request_id' : 'af6c29f98c729a0ca26f488dc550f73a'};
//scrapePage('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult');

url_search = 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult'
async function scrapePage(urlS) {
  var DATA= new FormData();
  
  DATA.append("page",1);
  DATA.append("request_id","9ebf002bbd8d0c6848ba156aa38eb26f");
  DATA.append("sort","undefined");
  console.log(DATA);
  //var DATA=querystring.stringify({params: JSON.stringify({'page' : 1, 'resquest_id' : 'd822d2cedfaacafc693a5910e3a41b44', 'sort' : 'undefinde' })});
  const option={
      url: urlS ,
      method: "post",
      data: DATA,
    };
  
  const response = await axios.post(urlS,querystring.stringify({
    page: 2,
    sort: 'undefined',
    request_id: '9ebf002bbd8d0c6848ba156aa38eb26f'
  }));
  const {data, status,error} = response;
  console.log(data);
  if (status >= 200 && status < 300 && !error) {

    parse(data);
  }
  else {
    console.log(error);
  }
};

scrapePage(url_search);
/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
/*
module.exports.get = () => {
  return [];
};*/
