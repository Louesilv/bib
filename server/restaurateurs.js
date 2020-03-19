const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
*/ 
const parse = data => {
  const $ = cheerio.load(data);

  var names = $('#zoneAnnuaire_layout > div.row.annuaire_result > div.col-md-9 > div.annuaire_result_list > div > div.single_desc > div.single_libel > a').text();
  var adresses = $('#zoneAnnuaire_layout > div.row.annuaire_result > div.col-md-9 > div.annuaire_result_list > div> div.single_desc > div.single_details > div > div > div').get().map(x => $(x).text());

  //var restaurant = {'name': name, 'adresse': adresse}
  console.log(names,adresses);
};


/**
 * Scrape a given restaurant url
 * @param  {String}  url

 */

//'request_id' : 'af6c29f98c729a0ca26f488dc550f73a'};
//scrapePage('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult');


async function scrapePage(url) {

    const option={
        'url': url ,
        'method' : 'POST',
        'data': {'result': 1,
                  'annuaire_mode': 'standard'}
                };
    
    const response = await axios(option);
    const {data, status,error} = response;
        console.log(status);


    if (status >= 200 && status < 300 && !error) {
      console.log(data);
      //return parse(data);
    }
    else {
      console.log(error);
    }

    //return null;
};
scrapePage('https://www.https://www.maitresrestaurateurs.fr/annuaire/recherche');
/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
/*
module.exports.get = () => {
  return [];
};*/
