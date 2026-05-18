from app import db

staff_courses = db.Table(
    'staff_courses',
    db.Column( 'staff_id',  db.Integer, db.ForeignKey( 'staff.id' ),    nullable=False ),
    db.Column( 'course_id', db.Integer, db.ForeignKey( 'courses.id' ),  nullable=False )
)

class Staff( db.Model ):
    __tablename__ = 'staff'

    id         = db.Column( db.Integer, primary_key=True )
    first_name = db.Column( db.String( 50 ),  nullable=False )
    last_name  = db.Column( db.String( 50 ),  nullable=False )
    email      = db.Column( db.String( 120 ), nullable=False, unique=True )
    role       = db.Column( db.String( 20 ),  nullable=False )  # 'Professor' or 'SI'

    courses = db.relationship( 'Course', secondary=staff_courses, backref='staff' )

    def to_dict( self ):
        return {
            'id':         self.id,
            'first_name': self.first_name,
            'last_name':  self.last_name,
            'email':      self.email,
            'role':       self.role
        }