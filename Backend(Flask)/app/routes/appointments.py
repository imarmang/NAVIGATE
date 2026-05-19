from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.appointment import Appointment
from datetime import datetime, date

appointments_bp = Blueprint( 'appointments', __name__ )


# Get all appointments for the logged in student
@appointments_bp.route( '/', methods=[ 'GET' ] )
@jwt_required()
def get_appointments():
    n_number = get_jwt_identity()
    appointments = Appointment.query.filter_by( n_number=n_number ).all()
    return jsonify( [ appointment.to_dict() for appointment in appointments ] ), 200


# Get booked time slots for a specific instructor on a specific date
@appointments_bp.route( '/booked-slots', methods=[ 'GET' ] )
@jwt_required()
def get_booked_slots():
    tutor_email = request.args.get( 'tutor_email', '' ).strip()
    date_str    = request.args.get( 'date', '' ).strip()

    if not tutor_email or not date_str:
        return jsonify( { 'message': 'tutor_email and date are required' } ), 400

    try:
        query_date = datetime.strptime( date_str, '%Y-%m-%d' ).date()
    except ValueError:
        return jsonify( { 'message': 'Invalid date format. Use YYYY-MM-DD' } ), 400

    appointments = Appointment.query.filter_by( tutor_email=tutor_email ).all()

    booked_slots = [
        a.appointment_date.strftime( '%H:%M' )
        for a in appointments
        if a.appointment_date.date() == query_date
    ]

    return jsonify( { 'booked_slots': booked_slots } ), 200


# Create a new appointment
@appointments_bp.route( '/', methods=[ 'POST' ] )
@jwt_required()
def create_appointment():
    n_number = get_jwt_identity()
    data     = request.json

    course               = data.get( 'course', '' ).strip()
    subject              = data.get( 'subject', '' ).strip()
    tutor_name           = data.get( 'tutor_name', '' ).strip()
    tutor_email          = data.get( 'tutor_email', '' ).strip()
    appointment_date_str = data.get( 'appointment_date', '' ).strip()
    message = data.get('message', '').strip()

    # Validate required fields
    if not all( [ course, subject, tutor_name, tutor_email, appointment_date_str ] ):
        return jsonify( { 'message': 'All fields are required' } ), 400

    # Parse the date string safely
    try:
        appointment_date = datetime.strptime( appointment_date_str, '%Y-%m-%dT%H:%M' )
    except ValueError:
        return jsonify( { 'message': 'Invalid date format. Use YYYY-MM-DDTHH:MM' } ), 400

    # Validate appointment is in the future
    if appointment_date <= datetime.now():
        return jsonify( { 'message': 'Appointment must be scheduled in the future' } ), 400

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
        return jsonify( { 'message': 'Instructor is not available at this time' } ), 409

    new_appointment = Appointment(
        n_number=n_number,
        tutor_email=tutor_email,
        tutor_name=tutor_name,
        subject=subject,
        course=course,
        appointment_date=appointment_date,
        message=message

    )

    db.session.add( new_appointment )
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
    data     = request.json

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