import re
from datetime import datetime, timezone

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app import db, bcrypt
from app.models.student import Student
from app.models.blacklisted_token import BlackListedToken

auth_bp = Blueprint( 'auth', __name__ )

VALID_EMAIL_DOMAINS = ( '@mynsu.nova.edu', '@nova.edu' )
N_NUMBER_PATTERN = re.compile( r'^N\d{8}$' )

# Register a new student
@auth_bp.route( '/register', methods=[ 'POST' ] )
def register():
    data = request.json

    first_name = data.get( 'first_name', '' ).strip()
    last_name  = data.get( 'last_name', '' ).strip()
    n_number   = data.get( 'n_number', '' ).strip()
    email      = data.get( 'email', '' ).strip()
    password   = data.get( 'password', '' )

    # Validate required fields
    if not all( [ first_name, last_name, n_number, email, password ] ):
        return jsonify( { "message": "All fields are required" } ), 400

    # Validate email domain
    if not email.endswith( VALID_EMAIL_DOMAINS ):
        return jsonify( { "message": "Email must be an NSU email address" } ), 400

    # Validate n_number format (N followed by 8 digits)
    if not N_NUMBER_PATTERN.match( n_number ):
        return jsonify( { "message": "N-Number must be N followed by 8 digits (e.g. N01234567)" } ), 400

    # Validate password length
    if len( password ) < 8:
        return jsonify( { "message": "Password must be at least 8 characters" } ), 400

    # Check if email is already in use
    if Student.query.filter_by( email=email ).first():
        return jsonify( { 'message': 'Email already in use' } ), 409

    # Check if n_number is already in use
    if Student.query.filter_by( n_number=n_number ).first():
        return jsonify( { 'message': 'N-number already in use' } ), 409

    # Hash the password
    pw_hash = bcrypt.generate_password_hash( password ).decode( 'utf-8' )

    # Create new student
    new_student = Student(
        first_name=first_name,
        last_name=last_name,
        n_number=n_number,
        email=email,
        password=pw_hash
    )

    db.session.add( new_student )
    db.session.commit()

    return jsonify( { 'message': 'Account created successfully' } ), 201


# Login a student
@auth_bp.route( '/login', methods=[ 'POST' ] )
def login():
    data = request.json

    email = data.get( 'email', '' ).strip()
    password = data.get( 'password', '' ).strip()

    # Validate the required fields
    if not email or not password:
        return jsonify( { 'message': 'Email and password are required' } ), 400

    # Find the student by email
    student = Student.query.filter_by( email=email ).first()

    if not student:
        return jsonify( { 'message': 'Invalid credentials' } ), 401

    # Check the password
    if not bcrypt.check_password_hash(student.password, password):
        return jsonify( { 'message': 'Invalid credentials' } ), 401

    # Create a JWT token with the student's n_number as the identity
    access_token = create_access_token( identity=student.n_number )

    return jsonify( { 'access_token': access_token, 'n_number': student.n_number } ), 200

# Logout — blacklist the current token
@auth_bp.route( '/logout', methods=[ 'POST' ] )
@jwt_required()
def logout():
    jwt_payload = get_jwt()
    jti = jwt_payload[ 'jti' ]
    expires_at  = datetime.fromtimestamp( jwt_payload[ 'exp' ], tz=timezone.utc )

    blacklisted = BlackListedToken( jti=jti, expires_at=expires_at )

    db.session.add( blacklisted )
    db.session.commit()

    return jsonify( { 'message': 'Logged out successfully' } ), 200

# Get the current logged in student
@auth_bp.route( '/me', methods=[ 'GET' ] )
@jwt_required()
def me():
    n_number = get_jwt_identity()
    student = Student.query.filter_by( n_number=n_number ).first()

    if not student:
        return jsonify( { 'message': 'Student not found' } ), 404

    return jsonify( student.to_dict() ), 200

# 200 - OK Status Code
# 201 - Created Status Code
# 400 - Bad Request, syntax error, invalid framing
# 404 - NOT FOUND Status Code
# 409 - errors sent to the client so that a user might be able to resolve a conflict and resubmit the request
