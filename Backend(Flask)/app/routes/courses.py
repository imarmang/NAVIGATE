from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.course import Course
from app.models.student import Student

courses_bp = Blueprint('courses', __name__)


# Get all available courses
@courses_bp.route('/', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses]), 200


# Get courses for the logged in student
@courses_bp.route('/my-courses', methods=['GET'])
@jwt_required()
def get_student_courses():
    n_number = get_jwt_identity()

    student = Student.query.filter_by(n_number=n_number).first()

    if not student:
        return jsonify({'message': 'Student not found'}), 404

    return jsonify([course.to_dict() for course in student.courses]), 200


# Update courses for the logged in student
@courses_bp.route('/my-courses', methods=['PUT'])
@jwt_required()
def update_student_courses():
    n_number = get_jwt_identity()
    data = request.json

    course_ids = data.get('course_ids')

    student = Student.query.filter_by(n_number=n_number).first()

    if not student:
        return jsonify({'message': 'Student not found'}), 404

    # Fetch the courses from the DB and replace the student's courses
    courses = Course.query.filter(Course.id.in_(course_ids)).all()
    student.courses = courses

    db.session.commit()

    return jsonify({'message': 'Courses updated successfully'}), 200