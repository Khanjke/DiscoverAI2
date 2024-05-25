import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS  # Импортируем CORS
from models.model import load_model, predict

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для всех маршрутов

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['FRONTEND_FOLDER'] = '../frontend'

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load the model once at startup
model = load_model()

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'tiff', 'bmp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return send_from_directory(app.config['FRONTEND_FOLDER'], 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(app.config['FRONTEND_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    print("Received request on /upload")
    if 'file' not in request.files:
        print("No file part")
        return jsonify(error='No file part'), 400
    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify(error='No selected file'), 400
    if file and allowed_file(file.filename):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        print(f"File saved to {filepath}")
        result = predict(model, filepath)
        print("Prediction result:", result)
        return jsonify(result)
    else:
        print("Invalid file type")
        return jsonify(error='Invalid file type'), 400

if __name__ == '__main__':
    app.run(debug=True)
