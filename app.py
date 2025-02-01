# git repo: https://github.com/YazRaso/MyByte/tree/main
# flask docs: https://flask.palletsprojects.com/en/stable/quickstart/
# api docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
# 3017624010701 - sample barcode
# https://world.openfoodfacts.org/api/v2/product/3017624010701
from flask import Flask, request, jsonify, render_template
import requests as r
# Initialize flask app
app = Flask(__name__)


@app.route('/', methods=["GET", "POST"])
def get_barcode():
    # Check if user submitted form
    if request.method == "POST":
        # Get barcode number from form
        barcode_number = request.form.get('barcode')
        # Retrieve data from OFF, fields=nutriments ensures we get the nutrition information specifically
        # TODO: It is probably best practice to store the api url in a .env file
        response = r.get(f"https://world.openfoodfacts.org/api/v2/product/{barcode_number}")
        # Check if our request was successful
        if response.status_code == 200:
            product = response.json()["product"]
            nutrition_info = {
                "name": product.get("product_name", "N/A"),
                "brand": product.get("brands", "N/A"),
                "quantity": product.get("quantity", "N/A"),
                "image": product.get("image_front_url", ""),
                "ingredients": product.get("ingredients_text", "N/A"),
                "allergens": ", ".join(product.get("allergens_tags", [])),
                "nutriscore": product.get("nutriscore_grade", "N/A").upper(),
                "nova_group": product.get("nova_group", "N/A"),
                "nutrients": product.get("nutriments", {})
            }
            return render_template("index.html", nutrition_info=nutrition_info)
    else:
        return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)