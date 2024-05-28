import requests
import json
from bs4 import BeautifulSoup
from elasticsearch import Elasticsearch

with open('burger_allergens.json') as file:
    allergen_data = json.load(file)

es = Elasticsearch('https://localhost:9200', ca_certs="http_ca.crt", basic_auth=("elastic", "aQkd6kZywGTVCUSxQrCU"), verify_certs=False)

for allergen in allergen_data['allergens']:
    es.index(index="allergens", body=allergen)

for restriction in allergen_data['dietary_restrictions']:
    es.index(index="dietary_restrictions", body=restriction)

print("dataset indexed.")

def fetch_and_parse(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.get_text()

def check_allergens_restrictions(text, allergens):
    matches = {
        "allergens": [],
        "dietary_restrictions": []
    }

    #for ingredient in ingredients:



url = input("Enter the URL of the burger recipe: ")
text = fetch_and_parse(url)
allergen_matches = check_allergens(text, allergen_data)
dietary_matches = check_dietary_restrictions(text, allergen_data)

print("Allergen matches found:")
for allergen, ingredients in allergen_matches.items():
    print(f"  {allergen}: {', ' .join(ingredients)}")

print("Dietary restriction matches found:")
for restriction, ingredients in dietary_matches.items():
    print(f"  {restriction}: {', ' .join(ingredients)}")
