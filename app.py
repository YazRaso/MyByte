# git repo: https://github.com/YazRaso/MyByte/tree/main
# flask docs: https://flask.palletsprojects.com/en/stable/quickstart/
# api docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
# 3017624010701 - sample barcode
# https://world.openfoodfacts.org/api/v2/product/3017624010701
from flask import Flask, request, jsonify, render_template
import requests as r

app = Flask(__name__)

@app.route('/', methods=["GET", "POST"])
def home():
    nutrition_info = None
    error = None
    
    if request.method == "POST":
        barcode_number = request.form.get("barcode_number")
        response = r.get(f"https://world.openfoodfacts.org/api/v2/product/{barcode_number}?fields=nutriments")
        if response.status_code == 200:
            nutrition_info = response.json()["product"]["nutriments"]
        else:
            error = "Barcode not found!"

    return render_template("index.html", nutrition_info=nutrition_info, error=error)

@app.route('/scan', methods=["POST"])
def barcode_scan():
    barcode_number = request.get_json().get('barcode')
    response = r.get(f"https://world.openfoodfacts.org/api/v2/product/{barcode_number}?fields=nutriments")
    print(response.status_code)
    if response.status_code == 200:
        nutrition_info = response.json().get("product", {}).get("nutriments", {})
        return jsonify(nutrition_info)
    else:
        return jsonify({"error": "Barcode not found!"}), 404

@app.route('/sign_in', methods=["GET", "POST"])
def sign_in():
    return render_template("sign_in.html")

@app.route('/sign_up', methods=["GET", "POST"])
def sign_up():
    return render_template("sign_up.html")

if __name__ == "__main__":
    app.run(debug=True)