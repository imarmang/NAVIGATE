from app import db
from datetime import datetime, timezone

class BlackListedToken( db.Model ):
    __tablename__ = 'blacklisted_tokens'


    id = db.Column ( db.Integer , primary_key = True )
    jti = db.Column ( db.String( 36 ), unique=True, nullable=False )
    expires_at = db.Column( db.DateTime, nullable=False )
    created_at = db.Column( db.DateTime, default=lambda: datetime.now( timezone.utc ) )

    @staticmethod
    def is_blacklisted( jti ):
        token = BlackListedToken.query.filter_by(jti=jti).first()
        return token is not None

    @staticmethod
    def purge_expired():
        """Delete tokens that have already expired - call periodically to keep the table clean."""
        BlackListedToken.query.filter(
            BlackListedToken.expires_at < datetime.now( timezone.utc )
        ).delete()

        db.session.commit()
