Hi Yaz, I made some changes

1. added requirements.txt
2. added static folder with styles.css and scripts.js
3. moved index.html to templates folder, and added base.html
4. renamed main.py to app.py

changes within app.py:

- changed route from submit_barcode to just /
- added and handled get request
- changed post request to display nutrition data within the same page

You should run the app using the command  
```
flask run
```