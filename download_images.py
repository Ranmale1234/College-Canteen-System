import urllib.request
import os

images = {
  'samosa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Samosa_in_the_making.jpg/800px-Samosa_in_the_making.jpg',
  'idli.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Idli_Sambar.JPG/800px-Idli_Sambar.JPG',
  'vadapav.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vada_Pav-Indian_street_food.jpg/800px-Vada_Pav-Indian_street_food.jpg',
  'poha.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Poha%2C_a_snack_made_of_beaten_rice.jpg/800px-Poha%2C_a_snack_made_of_beaten_rice.jpg',
  'upma.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Upma_made_from_Semolina.jpg/800px-Upma_made_from_Semolina.jpg',
  'vegthali.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Indian_vegetarian_thali.jpg/800px-Indian_vegetarian_thali.jpg',
  'noodles.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Rocoto_spaghetti.jpg/800px-Rocoto_spaghetti.jpg',
  'friedrice.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Restaurant_seafood_fried_rice.jpg/800px-Restaurant_seafood_fried_rice.jpg',
  'dalrice.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Dal_Makhani.jpg/800px-Dal_Makhani.jpg',
  'paneer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Paneer_tikka_masala.jpg/800px-Paneer_tikka_masala.jpg',
  'sandwich.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Grilled_cheese_sandwich.jpg/800px-Grilled_cheese_sandwich.jpg',
  'maggi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Maggi_Noodles.jpg/800px-Maggi_Noodles.jpg',
  'fries.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/French_Fries.jpg/800px-French_Fries.jpg',
  'lassi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Lassi_with_malai.jpg/800px-Lassi_with_malai.jpg',
  'chaas.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Chaas.jpg/800px-Chaas.jpg',
  'coldcoffee.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Frappe_coffee_in_a_glass.jpg/800px-Frappe_coffee_in_a_glass.jpg',
  'cocacola.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Coca-Cola_glass_bottle.jpg/800px-Coca-Cola_glass_bottle.jpg',
  'water.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Bottled_water.jpg/800px-Bottled_water.jpg'
}

os.makedirs('images', exist_ok=True)
opener = urllib.request.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
urllib.request.install_opener(opener)

for name, url in images.items():
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(url, os.path.join('images', name))
    except Exception as e:
        print(f"Failed to download {name}: {e}")
