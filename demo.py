import requests
import json
from bs4 import BeautifulSoup
from elasticsearch import Elasticsearch

with open('burger_allergens.json') as file:
    allergen_data = json.load(file)

es = Elasticsearch('https://localhost:9200', ca_certs="http_ca.crt", basic_auth=("elastic", "aQkd6kZywGTVCUSxQrCU"), verify_certs=False)

def fetch_and_parse(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.get_text()

def check_allergens(text, allergens):
    matches = {}
    for allergen in allergens['allergens']:
        matched_ingredients = [ingredient for ingredient in allergen['ingredients'] if ingredient in text]
        if matched_ingredients:
            matches[allergen['name']] = matched_ingredients
    return matches

def check_dietary_restrictions(text, restrictions):
    matches = {}
    for restriction in restrictions['dietary_restrictions']:
        matched_ingredients = [ingredient for ingredient in restriction['ingredients'] if ingredient in text]
        if matched_ingredients:
            matches[restriction['restriction']] = matched_ingredients
    return matches


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
