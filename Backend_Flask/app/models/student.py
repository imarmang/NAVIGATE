from app import db

student_courses = db.Table( 'student_courses',
    db.Column( 'student_id', db.Integer, db.ForeignKey( 'students.id', ondelete='CASCADE' ), primary_key=True ),
    db.Column( 'course_id',  db.Integer, db.ForeignKey( 'courses.id' ),                      primary_key=True )
)

class Student( db.Model ):
    __tablename__ = 'students'

    id         = db.Column( db.Integer,      primary_key=True )
    first_name = db.Column( db.String( 100 ), nullable=False )
    last_name  = db.Column( db.String( 100 ), nullable=False )
    n_number   = db.Column( db.String( 20 ),  unique=True, nullable=False )
    email      = db.Column( db.String( 255 ), unique=True, nullable=False )
    password   = db.Column( db.String( 255 ), nullable=False )

    courses      = db.relationship( 'Course', secondary=student_courses, backref='students' )
    appointments = db.relationship( 'Appointment',
                                    backref='student',
                                    cascade='all, delete-orphan',
                                    foreign_keys='Appointment.n_number',
                                    primaryjoin='Student.n_number == Appointment.n_number' )

    def to_dict( self ):
        return {
            'id':         self.id,
            'first_name': self.first_name,
            'last_name':  self.last_name,
            'n_number':   self.n_number,
            'email':      self.email,
            'courses':    [ course.to_dict() for course in self.courses ]
        }