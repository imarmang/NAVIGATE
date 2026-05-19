from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.staff import Staff
from app.models.course import Course

staff_bp = Blueprint( 'staff', __name__ )


# Get all staff, optionally filtered by course_id
@staff_bp.route( '/', methods=[ 'GET' ] )
@jwt_required()
def get_staff():
    course_id = request.args.get( 'course_id', type=int )

    if course_id:
        course = Course.query.get( course_id )
        if not course:
            return jsonify( { 'message': 'Course not found' } ), 404
        staff = course.staff
    else:
        staff = Staff.query.all()

    return jsonify( [
        {
            'id':         s.id,
            'first_name': s.first_name,
            'last_name':  s.last_name,
            'email':      s.email,
            'role':       s.role
        }
        for s in staff
    ] ), 200