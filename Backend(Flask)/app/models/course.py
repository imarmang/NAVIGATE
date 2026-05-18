from app import db

class Course( db.Model ):
    __tablename__ = 'courses'

    id        = db.Column( db.Integer, primary_key=True )
    subject   = db.Column( db.String( 50 ),  nullable=False )
    course_id = db.Column( db.String( 50 ),  nullable=False )
    name      = db.Column( db.String( 150 ), nullable=True )

    def to_dict(self):
        try:
            staff_list = [
                {
                    'id': s.id,
                    'first_name': s.first_name,
                    'last_name': s.last_name,
                    'email': s.email,
                    'role': s.role
                }
                for s in self.staff
            ]
        except Exception:
            staff_list = []

        return {
            'id': self.id,
            'subject': self.subject,
            'course_id': self.course_id,
            'name': self.name,
            'staff': staff_list
        }