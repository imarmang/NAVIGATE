"""
Seed script for Staff (Professors and SIs) with course assignments.
Run AFTER seed_courses.py.

    flask shell
    >>> from seed.seed_staff import seed
    >>> seed()
"""

from app import db
from app.models.staff import Staff
from app.models.course import Course


# Each entry: (first_name, last_name, email, role, [course_ids as subject+number strings])
STAFF = [

    # ── Professors ────────────────────────────────────────────────────────────

    {
        'first_name': 'James',
        'last_name':  'Hartwell',
        'email':      'jhartwell@nova.edu',
        'role':       'Professor',
        'courses':    [ ('MATH', '1200'), ('MATH', '2020'), ('MATH', '2100'), ('MATH', '2200') ]
    },
    {
        'first_name': 'Sarah',
        'last_name':  'Mitchell',
        'email':      'smitchell@nova.edu',
        'role':       'Professor',
        'courses':    [ ('MATH', '3300'), ('MATH', '4500'), ('PHYS', '2400') ]
    },
    {
        'first_name': 'Michael',
        'last_name':  'Torres',
        'email':      'mtorres@nova.edu',
        'role':       'Professor',
        'courses':    [ ('CSIS', '1800'), ('CSIS', '2000'), ('CSIS', '2050'), ('CSIS', '2101') ]
    },
    {
        'first_name': 'Robert',
        'last_name':  'Leinecker',
        'email':      'rleinecker@nova.edu',
        'role':       'Professor',
        'courses':    [ ('CSIS', '3101'), ('CSIS', '3200'), ('CSIS', '3400'), ('CSIS', '3460') ]
    },
    {
        'first_name': 'Elena',
        'last_name':  'Vasquez',
        'email':      'evasquez@nova.edu',
        'role':       'Professor',
        'courses':    [ ('CSIS', '3001'), ('CSIS', '3500'), ('CSIS', '4010'), ('CSIS', '4501') ]
    },
    {
        'first_name': 'Linda',
        'last_name':  'Chen',
        'email':      'lchen@nova.edu',
        'role':       'Professor',
        'courses':    [ ('CSIS', '3530'), ('CSIS', '3610'), ('CSIS', '4610') ]
    },
    {
        'first_name': 'David',
        'last_name':  'Okonkwo',
        'email':      'dokonkwo@nova.edu',
        'role':       'Professor',
        'courses':    [ ('CSIS', '3051'), ('CSIS', '3750'), ('CSIS', '3810') ]
    },
    {
        'first_name': 'Priya',
        'last_name':  'Sharma',
        'email':      'psharma@nova.edu',
        'role':       'Professor',
        'courses':    [ ('CSIS', '3020'), ('CSIS', '4311'), ('CSIS', '4351'), ('CSIS', '4530') ]
    },
    {
        'first_name': 'Maria',
        'last_name':  'Castillo',
        'email':      'mcastillo@nova.edu',
        'role':       'Professor',
        'courses':    [ ('TECH', '3300'), ('TECH', '3320'), ('TECH', '4200'), ('TECH', '4220'), ('TECH', '4240') ]
    },
    {
        'first_name': 'Thomas',
        'last_name':  'Wright',
        'email':      'twright@nova.edu',
        'role':       'Professor',
        'courses':    [ ('CSIS', '3023'), ('CSIS', '4903'), ('CSIS', '4953'), ('TECH', '4900'), ('TECH', '4950') ]
    },

    # ── Student Instructors (SIs) ─────────────────────────────────────────────

    {
        'first_name': 'Casey',
        'last_name':  'Morgan',
        'email':      'cmorgan@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '1800'), ('CSIS', '2101') ]
    },
    {
        'first_name': 'Taylor',
        'last_name':  'Brooks',
        'email':      'tbrooks@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '3400'), ('CSIS', '3460') ]
    },
    {
        'first_name': 'Jordan',
        'last_name':  'Kim',
        'email':      'jkim@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '3500'), ('CSIS', '4010') ]
    },
    {
        'first_name': 'Riley',
        'last_name':  'Santos',
        'email':      'rsantos@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('MATH', '2100'), ('MATH', '2200') ]
    },
    {
        'first_name': 'Avery',
        'last_name':  'Johnson',
        'email':      'ajohnson@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '3530'), ('CSIS', '4610') ]
    },
    {
        'first_name': 'Dakota',
        'last_name':  'Williams',
        'email':      'dwilliams@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '3020'), ('CSIS', '4311') ]
    },
    {
        'first_name': 'Quinn',
        'last_name':  'Martinez',
        'email':      'qmartinez@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '2000'), ('CSIS', '4530') ]
    },
    {
        'first_name': 'Blake',
        'last_name':  'Anderson',
        'email':      'banderson@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('TECH', '3300'), ('TECH', '3320') ]
    },
    {
        'first_name': 'Cameron',
        'last_name':  'Foster',
        'email':      'cfoster@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '3101'), ('CSIS', '3200') ]
    },
    {
        'first_name': 'Jamie',
        'last_name':  'Rivera',
        'email':      'jrivera@mynsu.nova.edu',
        'role':       'SI',
        'courses':    [ ('CSIS', '3051'), ('CSIS', '3810') ]
    },
]


def seed():
    added   = 0
    skipped = 0

    for s in STAFF:
        exists = Staff.query.filter_by( email=s['email'] ).first()

        if exists:
            skipped += 1
            continue

        staff_member = Staff(
            first_name = s['first_name'],
            last_name  = s['last_name'],
            email      = s['email'],
            role       = s['role']
        )

        for subject, course_id in s['courses']:
            course = Course.query.filter_by(
                subject=subject,
                course_id=course_id
            ).first()

            if course:
                staff_member.courses.append( course )

        db.session.add( staff_member )
        added += 1

    db.session.commit()
    print( f'Done - {added} staff added, {skipped} already existed.' )