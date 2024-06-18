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

# #Delete existing indices if they exist
# if es.indices.exists(index='allergens'):
#     es.indices.delete(index='allergens')

# # Create new indices
# es.indices.create(index='allergens')

# # Index each allergen individually
# for idx, allergen in enumerate(allergen_data['allergens']):
#     es.index(index='allergens', id=idx+1, body=allergen)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"'
}

def fetch_and_parse(url):
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.get_text()

def check_allergens(user_allergies, text):
    allergens = []

    for allergy in user_allergies:
        res = es.search(index="allergens", body={"query": {"match_phrase": {"Allergens": allergy}}})
        for hit in res['hits']['hits']:
            allergen_info = hit['_source']
            if allergen_info['Ingredient'] in text:
                allergens.append((allergen_info['Ingredient'], allergen_info['Allergens'], allergen_info['Substitution']))

    return allergens

# User inputs
user_allergies = input("Enter the allergies you have (comma separated): ").split(',')
user_allergies = [allergy.strip().lower() for allergy in user_allergies]
url = input("Enter the URL of the recipe: ")

text = fetch_and_parse(url).lower()
#print(text)
allergens = check_allergens(user_allergies, text)

if allergens:
    print("Allergens found in the recipe:")
    for ingredient, allergen, substitution in allergens:
        print(f"Ingredient: {ingredient}, Allergens: {allergen}, Substitution: {substitution}")
else:
    print("No allergens found in the recipe.")
