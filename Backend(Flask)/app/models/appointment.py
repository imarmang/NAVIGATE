from app import db

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    n_number = db.Column(db.String(20), db.ForeignKey('students.n_number'), nullable=False)
    tutor_email = db.Column(db.String(255), nullable=False)
    tutor_name = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(50), nullable=False)
    course = db.Column(db.String(50), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    message = db.Column(db.Text, default='')

    def to_dict(self):
        return {
            'id': self.id,
            'n_number': self.n_number,
            'tutor_email': self.tutor_email,
            'tutor_name': self.tutor_name,
            'subject': self.subject,
            'course': self.course,
            'appointment_date': self.appointment_date.strftime('%Y-%m-%dT%H:%M'),
            'message': self.message
        }