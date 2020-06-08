from flask import Blueprint

api_bp = Blueprint('api_bp', __name__) # "API Blueprint"

@api_bp.route("/greeting") # Blueprints don't use the Flask "app" context. They use their own
def greeting():
    return {'greeting': 'Hello from Flask!'}
