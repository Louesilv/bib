
const axios = require('axios');
const cheerio = require('cheerio');

console.log("a");
/*
axios('https://www.maitresrestaurateurs.fr/annuaire/recherche', (error,response,html)=>{
    console.log("ceciest un test");
    console.log(response.statusCode);
    if(error)
    {
        console.log(error);
    }

    if (status >= 200 && status < 300 && !error) {
        console.log(html);
        console.log("test2");
      }
});*/
const option={
    méthode: "get",
    url: 'https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/kokoro',
    timeout:5000,
};
//delegate function 

const parse = data => {
    const $ = cheerio.load(data);
    const name = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > h2').text();
    const adresse = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text();
  
  
    return {name, adresse};
  };

async function getHTML(options){
    const response = await axios(options);
    const {data, status,error} = response;

    if (status >= 200 && status < 300) {
        return console.log(parse(data));
    }
    else{
        console.log(error)  
    }
}
getHTML(option);
/*
axios ( {
    méthode: "get",
    url: 'https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/kokoro',
    timeout:5000,
  }).then (réponse => console.log (réponse.data))
  .catch (erreur => console.log (erreur));*/


  const parse2 = data => {
    const $ = cheerio.load(data);
    const url = $('').text();
  
  
    return {name, adresse};
  };
  
async function getHTML(options){
    const response = await axios(options);
    const {data, status,error} = response;

    if (status >= 200 && status < 300) {
        return console.log(parse(data));
    }
    else{
        console.log(error)  
    }
}