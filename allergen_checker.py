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

# Delete existing indices if they exist
if es.indices.exists(index='allergens'):
    es.indices.delete(index='allergens')

if es.indices.exists(index='recipes'):
    es.indices.delete(index='recipes')

# Create new indices
es.indices.create(index='allergens')
es.indices.create(index='recipes')

# Index each allergen individually
for idx, allergen in enumerate(allergen_data['allergens']):
    es.index(index='allergens', id=idx+1, body=allergen)

def fetch_and_parse(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.get_text()

def check_allergens(text):
    es.index(index='recipes', id=1, body={'content': text})
    
    allergens = []
    
    for idx in range(1, len(allergen_data['allergens']) + 1):
        allergen = es.get(index='allergens', id=idx)['_source']
        res = es.search(index="recipes", body={"query": {"match_phrase": {"content": allergen['Ingredient']}}})
        if res['hits']['total']['value'] > 0:
            allergens.append((allergen['Ingredient'], allergen['Allergens'], allergen['Substitution']))
    
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
