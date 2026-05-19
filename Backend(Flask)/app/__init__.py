from datetime import timedelta

from flask_cors import CORS
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

import atexit
import logging
import os

# APScheduler runs background jobs on a timer without blocking request handling.
from apscheduler.schedulers.background import BackgroundScheduler

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
# Shared scheduler instance; started once when the Flask app is created.
scheduler = BackgroundScheduler( daemon=True )


def create_app():
    app = Flask( __name__ )

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s: %(message)s',
    )

    # Config
    app.config[ 'SQLALCHEMY_DATABASE_URI' ] = os.getenv( 'DATABASE_URL' )
    app.config[ 'SQLALCHEMY_ENGINE_OPTIONS' ] = { 'pool_pre_ping': True }
    app.config[ 'SQLALCHEMY_TRACK_MODIFICATIONS' ] = False
    app.config[ 'JWT_SECRET_KEY' ] = os.getenv( 'JWT_SECRET_KEY' )
    app.config[ 'JWT_ACCESS_TOKEN_EXPIRES' ] = timedelta( hours=24 )
    # How often APScheduler calls BlackListedToken.purge_expired() (env override supported).
    app.config[ 'BLACKLIST_PURGE_INTERVAL_MINUTES' ] = int( os.getenv( 'BLACKLIST_PURGE_INTERVAL_MINUTES', '60' ) )

    # Initialize extensions
    db.init_app( app )
    bcrypt.init_app( app )
    jwt.init_app( app )
    CORS( app )

    from app.models.blacklisted_token import BlackListedToken
    from app.models.staff import Staff

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

    # Start periodic cleanup of expired logout tokens (see _init_blacklist_purge_scheduler).
    _init_blacklist_purge_scheduler( app )

    return app


def _init_blacklist_purge_scheduler( app ):
    """
    Register and start APScheduler job for the JWT blacklist table.

    On logout, revoked tokens stay in blacklisted_tokens until their JWT expires.
    After that they are useless for auth but still occupy rows. This job runs on an
    interval and deletes rows where expires_at is in the past so the table stays small.
    """
    from app.models.blacklisted_token import BlackListedToken

    scheduler_logger = logging.getLogger( __name__ )

    def purge_expired_blacklist():
        scheduler_logger.info( 'Running scheduled blacklisted token purge' )
        # Flask-SQLAlchemy needs an app context for DB access outside a request.
        with app.app_context():
            BlackListedToken.purge_expired()

    # Register the job once; replace_existing avoids duplicates if create_app runs again.
    if scheduler.get_job( 'purge_blacklisted_tokens' ) is None:
        scheduler.add_job(
            func=purge_expired_blacklist,
            trigger='interval',
            minutes=app.config[ 'BLACKLIST_PURGE_INTERVAL_MINUTES' ],
            id='purge_blacklisted_tokens',
            replace_existing=True,
        )

    # With debug=True, Flask's reloader spawns two processes; only start in the worker.
    if not scheduler.running and (
        not app.debug or os.environ.get( 'WERKZEUG_RUN_MAIN' ) == 'true'
    ):
        scheduler.start()
        # Shut down the scheduler cleanly when the process exits.
        atexit.register( lambda: scheduler.shutdown( wait=False ) )