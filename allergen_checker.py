from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import os
import json
from bs4 import BeautifulSoup
from elasticsearch import Elasticsearch
import urllib3
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

# Ignore warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

code_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(code_dir, 'dataset', 'ingredients_allergens.json')
chormedriver_path = os.path.join(code_dir, 'chromedriver.exe')

es = Elasticsearch('https://localhost:9200', ca_certs="http_ca.crt", basic_auth=("elastic", "aQkd6kZywGTVCUSxQrCU"), verify_certs=False)

# # uncomment this part to update the elasticsearch index when the dataset updated
# with open(json_path) as file:
#     allergen_data = json.load(file)

# #Delete existing indices if they exist
# if es.indices.exists(index='allergens'):
#     es.indices.delete(index='allergens')

# # Create new indices
# es.indices.create(index='allergens')

# # Index each allergen individually
# for idx, allergen in enumerate(allergen_data):
#     es.index(index='allergens', id=idx + 1, body=allergen)

# Configure Selenium 
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("--disable-extensions")
chrome_options.add_argument("--disable-infobars")
chrome_options.add_argument("--incognito")

chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

service = Service(executable_path=chormedriver_path)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"'
}

def fetch_and_parse_requests(url):
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.get_text()

def fetch_and_parse_selenium(url):
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.get(url)
    # # for lazy loading just in case
    # driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()
    return soup.get_text()

def check_allergens(user_allergies, text):
    allergens = set()
    found_allergens = []

    for allergy in user_allergies:
        res = es.search(index="allergens", body={"query": {"match_phrase": {"allergy_category": allergy}}})
        for hit in res['hits']['hits']:
            allergen_info = hit['_source']
            if allergen_info['name'] in text and allergen_info['name'] not in allergens:
                allergens.add(allergen_info['name'])
                found_allergens.append((allergen_info['name'],allergen_info['name'], allergen_info['allergy_category']))

            par_res = es.search(index="allergens", body={"query": {"match_phrase": {"ingredients": allergen_info['name']}}})
            for hit in par_res['hits']['hits']:
                par_allergen_info = hit['_source']
                if par_allergen_info['name'] in text and par_allergen_info['name'] not in allergens:
                    allergens.add(par_allergen_info['name'])
                    found_allergens.append((par_allergen_info['name'], allergen_info['name'], allergen_info['allergy_category']))
                    
    return found_allergens

@app.route('/check_allergens', methods=['POST'])
def check_allergens_route():
    data = request.json
    user_allergies = data.get('user_allergies', [])
    url = data.get('url', '')
    text_blob = data.get('text_blob', '')
    use_selenium = data.get('use_selenium', False)

    if text_blob:
        text = text_blob.lower()
    elif url:
        if use_selenium:
            text = fetch_and_parse_selenium(url).lower()
        else:
            text = fetch_and_parse_requests(url).lower()
    else:
        return jsonify({"error": "No URL or text provided"}), 400
    
    allergens = check_allergens(user_allergies, text)
    result = []
    for parent, ingredient, allergen in allergens:
        result.append({
            "parent_ingredient": parent,
            "ingredient": ingredient,
            "allergen": allergen
        })

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

