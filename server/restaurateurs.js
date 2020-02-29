const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
*/ 
const parse = data => {
  const $ = cheerio.load(data);
  const name = $('#zoneAnnuaire_layout > div.row.annuaire_result > div.col-md-9 > div.annuaire_result_list > div.annuaire_single.row-31 > div.single_desc > div.single_libel').text();
  const experience = $('#experience-section > ul > li:nth-child(2)').text();


  return {name, experience};
};


/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapePage  = async url => {

    const payload={ 'page' : 153,
                    'request_id' : 'af6c29f98c729a0ca26f488dc550f73a'};
    const option={
        'url': 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
        'method' : 'POST',
        'headers': {'content-type': ' application/x-www-form-urlencoded'}};
    
    const response = await axios(options);
    const {data, status} = response;
        console.log(data);


    if (status >= 200 && status < 300) {
        return parse(data);
    }

    console.error(status);

    return null;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
