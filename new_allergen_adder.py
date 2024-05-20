import json

def add_allergen(data, name, ingredients):
    for allergen in data['allergens']:
        if allergen['name'].lower() == name.lower():
            for ingredient in ingredients:
                if ingredient not in allergen['ingredients']:
                    allergen['ingredients'].append(ingredient)
                    print("new ingredient added")
            return

    new_allergen = {
        "name": name,
        "ingredients": ingredients
    }
    data['allergens'].append(new_allergen)
    print("new allergen added")

def add_dietary_restriction(data, restriction, ingredients):
    for diet in data['dietary_restrictions']:
        if diet['restriction'].lower() == restriction.lower():
            for ingredient in ingredients:
                if ingredient not in diet['ingredients']:
                    diet['ingredients'].append(ingredient)
                    print("new ingredient added")
            return
    new_restriction = {
        "restriction": restriction,
        "ingredients": ingredients
    }
    data['dietary_restrictions'].append(new_restriction)
    print("new dietary restriction added")

with open('burger_allergens.json', 'r') as file:
    data = json.load(file)

# Add a new allergen
new_allergen_name = "wheat"
new_allergen_ingredients = ["bun", "wheat-based filler"]
add_allergen(data, new_allergen_name, new_allergen_ingredients)

# Add a new dietary restriction
new_restriction = ""
new_restriction_ingredients = []
#add_dietary_restriction(data, new_restriction, new_restriction_ingredients)

with open('burger_allergens.json', 'w') as file:
    json.dump(data, file, indent=4)

