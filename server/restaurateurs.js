const axios = require('axios');
const cheerio = require('cheerio');
const querystring= require ('querystring');
const fs = require('fs');

const maitres=[];
url_search = 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult';

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
*/ 
const parse = data => {
  const $ = cheerio.load(data);
  const info = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-content-infos.row > div.ep-infos-txt').text().trim().split("\n");
  const body =$('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5').text().trim().split("\n");
  
  var restaurant = {'name': info[0],
                  'gérant':info[3].trim(),
                  'adresse':{"street": body[9].trim(),"code":body[12].trim(),"city":info[7].trim()},
                  'siteWEB':body[29].trim(),
                  'telephone':body[26].trim(),
                  'mail':body[32]};
  return restaurant;
  
};
/**
 * Get Data from a page restaurant 
 * @param  {String} urL - url from a restaurant
 * @return {Object} restaurant
*/ 
async function GetInfoOneRestaurant(urL) {

  const option={
    méthode: "get",
    url: urL,
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


/**
 * Get all the url for a given page 
 * @param  {String} urlS - url page
 * @param  {String} PAGE - given page
 * @return profils - list of all the url inside a page 
*/ 
async function ScrapePage(urlS,PAGE) {
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
    page: '${PAGE}',
    sort: 'undefined',
    request_id: '9ebf002bbd8d0c6848ba156aa38eb26f'
  }));

  const {data, status,error} = response;

  if (status >= 200 && status < 300 && !error) {
    const $ = cheerio.load(data);
    const profils= $('body > div.col-md-9 > div.annuaire_result_list > div > div.single_desc > div.single_libel > a').get().map(x => $(x).attr('href'));
    return profils;
  }
  else {
    console.log(error);
  }
};


async function GetAllURL(urL,liste){
  compt=1;
  while(compt<138){
    const profils =await ScrapePage(urL,compt);
    console.log("PAGE: " + compt);
    for (int in profils)
      {
        liste.push(profils[int]);      
      }
    compt+=1;
  }
  return liste;
};

async function GetAllInfoRestaurant(profils){
  var maitres=[];
  for (int in profils)
  {
      const rest = await GetInfoOneRestaurant('https://www.maitresrestaurateurs.fr'+profils[int]);
      console.log(int);
      const json = JSON.stringify(rest);
      maitres.push(json);      
  } 
  return maitres;
};

async function Get2(urL){

  var profils = await GetAllURL(urL,[]);
  var maitres = await GetAllInfoRestaurant(profils);

  const Maitrejson = JSON.stringify(maitres);
  const File = fs.writeFile("./maitres.json",Maitrejson,(err)=>{
    if(err){console.log(err);}
    console.log("Data written");}
  );
};

Get2(url_search);
/*
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
/*
module.exports.get = (urL,liste) => {
  var compt=1;
  while(compt<5){
    liste = GetInfo(urL,liste);

    console.log(liste);
    //const json = JSON.stringify(liste);
    //const File = fs.writeFile("./maitres.json",json);
    compt+=1;
  }
  return [];
};

File = module.exports.get(url_search,maitres); */
