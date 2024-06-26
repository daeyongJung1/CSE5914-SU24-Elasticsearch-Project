const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const es = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'aQkd6kZywGTVCUSxQrCU'
  },
  tls: {
    ca: fs.readFileSync('http_ca.crt'),
    rejectUnauthorized: false
  }
});

const jsonPath = path.join(__dirname, 'dataset', 'ingredients_allergens.json');
const allergenData = JSON.parse(fs.readFileSync(jsonPath));

async function fetchAndParseRequests(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  const $ = cheerio.load(response.data);
  return $.text();
}

async function checkAllergens(userAllergies, text) {
  const allergens = new Set();
  const foundAllergens = [];

  for (const allergy of userAllergies) {
    const res = await es.search({
      index: 'allergens',
      body: {
        query: {
          match_phrase: { allergy_category: allergy }
        }
      }
    });

    for (const hit of res.body.hits.hits) {
      const allergenInfo = hit._source;
      if (text.includes(allergenInfo.name) && !allergens.has(allergenInfo.name)) {
        allergens.add(allergenInfo.name);
        foundAllergens.push({ parent: allergenInfo.name, ingredient: allergenInfo.name, allergen: allergenInfo.allergy_category });
      }

      const parRes = await es.search({
        index: 'allergens',
        body: {
          query: {
            match_phrase: { ingredients: allergenInfo.name }
          }
        }
      });

      for (const parHit of parRes.body.hits.hits) {
        const parAllergenInfo = parHit._source;
        if (text.includes(parAllergenInfo.name) && !allergens.has(parAllergenInfo.name)) {
          allergens.add(parAllergenInfo.name);
          foundAllergens.push({ parent: parAllergenInfo.name, ingredient: allergenInfo.name, allergen: allergenInfo.allergy_category });
        }
      }
    }
  }
  return foundAllergens;
}

app.post('/check-allergens', async (req, res) => {
  const { userAllergies, url } = req.body;
  const lowerCaseAllergies = userAllergies.map(allergy => allergy.toLowerCase());
  const text = (await fetchAndParseRequests(url)).toLowerCase();
  const allergens = await checkAllergens(lowerCaseAllergies, text);
  res.json(allergens);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
