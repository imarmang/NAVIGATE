from app import db

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(50), nullable=False)
    course_id = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'course_id': self.course_id
        }