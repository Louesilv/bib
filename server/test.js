
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
axios ( {
    méthode: "get",
    url: 'https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/kokoro',
    timeout:5000,
  }).then (réponse => console.log (réponse.data))
  .catch (erreur => console.log (erreur));