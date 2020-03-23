/* eslint-disable no-console, no-process-exit 
const michelin = require('./michelin');

async function sandbox (searchLink = 'https://guide.michelin.com/fr/fr/centre-val-de-loire/veuves/restaurant/l-auberge-de-la-croix-blanche') {
  try {
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);

    const restaurant = await michelin.scrapeRestaurant(searchLink);

    console.log(restaurant);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;

sandbox(searchLink);*/
const fs = require("fs");
const path =require ("path");


/*

const fileM= fs.readFile("../bib/maitres.json",(err,data)=>{
  if(err){console.log(err);}
  else{console.log("Read File ok");
      return data;
}}
);
const fileB= fs.readFile("../bib/bib_gourmand.json",(err,data)=>{
  if(err){console.log(err);}
  else{console.log("Read File ok");
  return data;}}
);

const maitres= JSON.parse(fileM);
const bib_gourmand= JSON.parse(fileB);
*/

const fileM= fs.readFileSync("../bib/maitres.json");
const fileB= fs.readFileSync("../bib/bib_gourmand.json");

var maitres= JSON.parse(fileM);
var bib_gourmand= JSON.parse(fileB);


function Match(listeM,listeB)
{
  const match =[];
    for(int in listeB)
    {
      for (int2 in listeM)
      {
        const site2 = "http://"+ listeM[int2].siteWEB;
        const site1= listeB[int].siteWEB;
        if (site2==site1)
        {
            match.push(listeM[int2]);
        }
      }
    }
  return match;
}
//const test = maitres[0].siteWEB;
//console.log(bib_gourmand[1].telephone.,maitres[20].telephone);
const match = Match(maitres,bib_gourmand);
console.log(match);

