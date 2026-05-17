from flask_cors import CORS
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask( __name__ )

    # Config
    app.config[ 'SQLALCHEMY_DATABASE_URI' ] = os.getenv( 'DATABASE_URL' )
    app.config[ 'SQLALCHEMY_TRACK_MODIFICATIONS' ] = False
    app.config[ 'JWT_SECRET_KEY' ] = os.getenv( 'JWT_SECRET_KEY' )

    # Initialize extensions
    db.init_app( app )
    bcrypt.init_app( app )
    jwt.init_app( app )
    CORS( app )

    from app.models.blacklisted_token import BlackListedToken

    @jwt.token_in_blocklist_loader
    def check_if_token_is_blacklisted( jwt_header, jwt_payload ):
        return BlackListedToken.is_blacklisted( jwt_payload[ 'jti' ] )

    @jwt.revoked_token_loader
    def revoked_token_callback( jwt_header, jwt_payload ):
        from flask import jsonify
        return jsonify( { 'message': 'Token has been revoked. Please log in again.' } ), 401


    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.appointments import appointments_bp
    from app.routes.courses import courses_bp

    app.register_blueprint( auth_bp, url_prefix='/auth' )
    app.register_blueprint( appointments_bp, url_prefix='/appointments' )
    app.register_blueprint( courses_bp, url_prefix='/courses' )

    return app
