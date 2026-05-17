from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.appointment import Appointment
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)


# Get all appointments for the logged in student
@appointments_bp.route('/', methods=['GET'])
@jwt_required()
def get_appointments():
    n_number = get_jwt_identity()

    appointments = Appointment.query.filter_by( n_number=n_number ).all()

    return jsonify( [ appointment.to_dict() for appointment in appointments ] ), 200


# Create a new appointment
@appointments_bp.route('/', methods=['POST'])
@jwt_required()
def create_appointment():
    n_number = get_jwt_identity()
    data = request.json

    course           = data.get( 'course', '' ).strip()
    subject          = data.get( 'subject', '' ).strip()
    tutor_name       = data.get( 'tutor_name' , '' ).strip()
    tutor_email      = data.get( 'tutor_email', '' ).strip()
    appointment_date = data.get( 'appointment_date', '' ).strip()

    # Validate required fields
    if not all( [ course, subject, tutor_name, tutor_email, appointment_date ] ):
        return jsonify( { 'message': 'All fields are required' } ), 400

    # Convert the date string to a datetime object
    try:
        appointment_date = datetime.strptime(appointment_date, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'message': 'Appointment must be scheduled in the future'}), 400

    # Validate appointment is in the future
    if appointment_date <= datetime.now():
        return jsonify( { 'message': 'Date must be in the future' } ), 400

    # Check if the student already has an appointment at this time
    existing_student_appointment = Appointment.query.filter_by(
        n_number=n_number,
        appointment_date=appointment_date
    ).first()

    if existing_student_appointment:
        return jsonify( { 'message': 'You already have an appointment at this time' } ), 409

    # Check if the tutor already has an appointment at this time
    existing_tutor_appointment = Appointment.query.filter_by(
        tutor_email=tutor_email,
        appointment_date=appointment_date
    ).first()

    if existing_tutor_appointment:
        return jsonify( { 'message': 'Tutor is not available at this time' } ), 409

    new_appointment = Appointment(
        n_number=n_number,
        tutor_email=tutor_email,
        tutor_name=tutor_name,
        subject=subject,
        course=course,
        appointment_date=appointment_date
    )

    db.session.add(new_appointment)
    db.session.commit()

    return jsonify( { 'message': 'Appointment created successfully' } ), 201


# Delete an appointment
@appointments_bp.route( '/<int:appointment_id>', methods=[ 'DELETE' ] )
@jwt_required()
def delete_appointment( appointment_id ):
    n_number = get_jwt_identity()

    appointment = Appointment.query.filter_by(
        id=appointment_id,
        n_number=n_number
    ).first()

    if not appointment:
        return jsonify( { 'message': 'Appointment not found' } ), 404

    db.session.delete( appointment )
    db.session.commit()

    return jsonify( { 'message': 'Appointment deleted successfully' } ), 200


# Update appointment message
@appointments_bp.route( '/<int:appointment_id>/message', methods=[ 'PUT' ] )
@jwt_required()
def update_message( appointment_id ):
    n_number = get_jwt_identity()
    data = request.json

    message = data.get( 'message' )

    appointment = Appointment.query.filter_by(
        id=appointment_id,
        n_number=n_number
    ).first()

    if not appointment:
        return jsonify( { 'message': 'Appointment not found' } ), 404

    appointment.message = message
    db.session.commit()

    return jsonify( { 'message': 'Message updated successfully' } ), 200

# 200 - OK Status Code
# 400 - Bad Request, syntax error, invalid framing
# 404 - NOT FOUND Status Code
# 409 - errors sent to the client so that a user might be able to resolve a conflict and resubmit the request

