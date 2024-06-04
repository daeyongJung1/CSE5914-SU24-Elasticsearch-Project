import requests
import json
from bs4 import BeautifulSoup
from elasticsearch import Elasticsearch
import urllib3

# Ignore warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

with open('burger_allergens.json') as file:
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
    es.index(index='recipes', id=1, body={'url': url, 'content': text})
    allergens_data = es.get(index='allergens', id=1)['_source']
    
    allergens = []
    dietary_restrictions = []
    
    # comparing the website data and database
    for allergen in allergens_data['allergens']:
        for ingredient in allergen['ingredients']:
            res = es.search(index="recipes", body={"query":{"match_phrase":{"content": ingredient}}})
            if res['hits']['total']['value'] > 0:
                allergens.append(allergen['name'])
                break
    
    for restriction in allergens_data['dietary_restrictions']:
        for ingredient in restriction['ingredients']:
            res = es.search(index="recipes", body={"query":{"match_phrase":{"content": ingredient}}})
            if res['hits']['total']['value'] > 0:
                dietary_restrictions.append(restriction['restriction'])
                break
    
    return allergens, dietary_restrictions

url = input("Enter the URL of the burger recipe: ")
text = fetch_and_parse(url)
allergens, dietary_restrictions = check_allergens(text)

if allergens:
    print("Allergens found in the recipe: ", ', '.join(allergens))
else:
    print("No allergens found in the recipe.")
    
if dietary_restrictions:
    print("Dietary restrictions that match the recipe: ", ', '.join(dietary_restrictions))
else:
    print("No dietary restrictions match the recipe.")
