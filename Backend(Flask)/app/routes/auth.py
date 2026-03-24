from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models.student import Student

auth_bp = Blueprint('auth', __name__)


# Register a new student
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    first_name = data.get('first_name')
    last_name = data.get('last_name')
    n_number = data.get('n_number')
    email = data.get('email')
    password = data.get('password')

    # Check if email is already in use
    if Student.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already in use'}), 403

    # Check if n_number is already in use
    if Student.query.filter_by(n_number=n_number).first():
        return jsonify({'message': 'N-number already in use'}), 403

    # Hash the password
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create new student
    new_student = Student(
        first_name=first_name,
        last_name=last_name,
        n_number=n_number,
        email=email,
        password=pw_hash
    )

    db.session.add(new_student)
    db.session.commit()

    return jsonify({'message': 'Account created successfully'}), 200


# Login a student
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    email = data.get('email')
    password = data.get('password')

    # Find the student by email
    student = Student.query.filter_by(email=email).first()

    if not student:
        return jsonify({'message': 'Invalid credentials'}), 401

    # Check the password
    if not bcrypt.check_password_hash(student.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Create a JWT token with the student's n_number as the identity
    access_token = create_access_token(identity=student.n_number)

    return jsonify({'access_token': access_token, 'n_number': student.n_number}), 200


# Get the current logged in student
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    n_number = get_jwt_identity()
    student = Student.query.filter_by(n_number=n_number).first()

    if not student:
        return jsonify({'message': 'Student not found'}), 404

    return jsonify(student.to_dict()), 200