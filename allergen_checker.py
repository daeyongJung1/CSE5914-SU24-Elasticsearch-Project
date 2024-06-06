import requests
import json
from bs4 import BeautifulSoup
from elasticsearch import Elasticsearch
import urllib3

# Ignore warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

with open('allergen_database.json') as file:
    allergen_data = json.load(file)

es = Elasticsearch('https://localhost:9200', ca_certs="http_ca.crt", basic_auth=("elastic", "aQkd6kZywGTVCUSxQrCU"), verify_certs=False)

# index database
es.index(index='allergens', id=1, body=allergen_data)

def fetch_and_parse(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.get_text()

def check_allergens(text):
    # index the website
    es.index(index='recipes', id=2, body={'url': url, 'content': text})
    allergens_data = es.get(index='allergens', id=1)['_source']
    
    allergens = []
    
    # comparing the website data and database
    for allergen in allergens_data['allergens']:
        for ingredient in allergen['Ingredient']:
            res = es.search(index="recipes", body={"query":{"match_phrase":{"content": ingredient}}})
            if res['hits']['total']['value'] > 0:
                allergens.append((allergen['Ingredient'], allergen['Allergens'], allergen['Substitution']))
                break
        
    return allergens

url = input("Enter the URL of the burger recipe: ")
text = fetch_and_parse(url)
allergens = check_allergens(text)

if allergens:
    print("Allergens found in the recipe:")
    for ingredient, allergen, substitution in allergens:
        print(f"Ingredient: {ingredient}, Allergens: {allergen}, Substitution: {substitution}")
else:
    print("No allergens found in the recipe.")
