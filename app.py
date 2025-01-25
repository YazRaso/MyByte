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
        response = r.get(f"https://world.openfoodfacts.net/api/v2/product/{barcode_number}?fields=nutriments")
        # Check if our request was successful
        if response.status_code == 200:
            # Format json to get nutrition information
            nutrition_info = response.json()["product"]["nutriments"]
            return render_template("index.html", nutrition_info=nutrition_info)
    else:
        return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)