from transformers import pipeline
from PIL import Image

def load_model():
    """
    Load the deepfake detection model from Hugging Face.
    """
    model = pipeline('image-classification', model='dima806/deepfake_vs_real_image_detection')
    return model

def predict(model, image_path):
    """
    Predict whether the image is real or fake using the loaded model.
    
    :param model: The loaded model pipeline.
    :param image_path: The path to the image to be predicted.
    :return: The prediction result from the model.
    """
    image = Image.open(image_path)
    result = model(image)
    return result
