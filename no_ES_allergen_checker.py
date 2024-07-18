from flask import Flask, request, jsonify
import os
import json
from bs4 import BeautifulSoup
import urllib3
import requests

app = Flask(__name__)

# Ignore warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

code_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(code_dir, 'dataset', 'ingredients_allergens.json')
chormedriver_path = os.path.join(code_dir, 'chromedriver.exe')

with open(json_path) as file:
    allergen_data = json.load(file)

# Configure headers and options for requests and Selenium
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def fetch_and_parse_requests(url):
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    return soup.get_text()

def fetch_and_parse_selenium(url):
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options

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

    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.get(url)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()
    return soup.get_text()

def check_allergens(user_allergies, text):
    allergens = set()
    found_allergens = []

    for allergy in user_allergies:
        for allergen in allergen_data:
            if allergen['allergy_category'] == allergy:
                if allergen['name'] in text and allergen['name'] not in allergens:
                    allergens.add(allergen['name'])
                    found_allergens.append((allergen['name'], allergen['allergy_category']))
                    
    return found_allergens

@app.route('/check_allergens', methods=['POST'])
def check_allergens_route():
    data = request.json
    user_allergies = data.get('user_allergies', [])
    url = data.get('url', '')
    use_selenium = data.get('use_selenium', False)

    if use_selenium:
        text = fetch_and_parse_selenium(url).lower()
    else:
        text = fetch_and_parse_requests(url).lower()
    
    allergens = check_allergens(user_allergies, text)
    result = []
    for ingredient, allergen in allergens:
        result.append({
            "ingredient": ingredient,
            "allergen": allergen
        })

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
