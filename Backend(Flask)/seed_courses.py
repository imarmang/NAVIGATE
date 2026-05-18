"""
Seed script for NSU College of Computing, AI, and Cybersecurity (CCAC) courses.
Covers all three undergraduate programs:
  - B.S. in Computer Science
  - B.S. in Information Technology
  - B.S. in Cybersecurity Management

Run from the backend root:

    flask shell
    >>> from seed_courses import seed
    >>> seed()
"""

from app import db
from app.models.course import Course


COURSES = [

    # ── Mathematics ───────────────────────────────────────────────────────────
    { 'subject': 'MATH', 'course_id': '1200', 'name': 'Precalculus Algebra'           },
    { 'subject': 'MATH', 'course_id': '2020', 'name': 'Applied Statistics'            },
    { 'subject': 'MATH', 'course_id': '2100', 'name': 'Calculus I'                    },
    { 'subject': 'MATH', 'course_id': '2200', 'name': 'Calculus II'                   },
    { 'subject': 'MATH', 'course_id': '3300', 'name': 'Introductory Linear Algebra'   },
    { 'subject': 'MATH', 'course_id': '4500', 'name': 'Probability and Statistics'    },

    # ── Physics ───────────────────────────────────────────────────────────────
    { 'subject': 'PHYS', 'course_id': '2400', 'name': 'Physics I / Lab'               },

    # ── CSIS Core ─────────────────────────────────────────────────────────────
    { 'subject': 'CSIS', 'course_id': '1800', 'name': 'Introduction to Computer and Information Sciences' },
    { 'subject': 'CSIS', 'course_id': '2000', 'name': 'Introduction to Database Systems'                 },
    { 'subject': 'CSIS', 'course_id': '2050', 'name': 'Discrete Mathematics'                             },
    { 'subject': 'CSIS', 'course_id': '2101', 'name': 'Fundamentals of Computer Programming'             },
    { 'subject': 'CSIS', 'course_id': '3001', 'name': 'Introduction to Cybersecurity'                    },
    { 'subject': 'CSIS', 'course_id': '3020', 'name': 'Web Programming and Design'                       },
    { 'subject': 'CSIS', 'course_id': '3023', 'name': 'Legal and Ethical Aspects of Computers'           },
    { 'subject': 'CSIS', 'course_id': '3051', 'name': 'Computer Organization and Architecture'           },
    { 'subject': 'CSIS', 'course_id': '3101', 'name': 'Advanced Computer Programming'                    },
    { 'subject': 'CSIS', 'course_id': '3200', 'name': 'Organization of Programming Languages'            },
    { 'subject': 'CSIS', 'course_id': '3400', 'name': 'Data Structures'                                  },
    { 'subject': 'CSIS', 'course_id': '3460', 'name': 'Object-Oriented Design'                           },
    { 'subject': 'CSIS', 'course_id': '3500', 'name': 'Networks and Data Communication'                  },
    { 'subject': 'CSIS', 'course_id': '3530', 'name': 'Artificial Intelligence'                          },
    { 'subject': 'CSIS', 'course_id': '3610', 'name': 'Numerical Analysis'                               },
    { 'subject': 'CSIS', 'course_id': '3750', 'name': 'Software Engineering'                             },
    { 'subject': 'CSIS', 'course_id': '3810', 'name': 'Operating Systems Concepts'                       },
    { 'subject': 'CSIS', 'course_id': '4010', 'name': 'Computer Security'                                },
    { 'subject': 'CSIS', 'course_id': '4311', 'name': 'Web Services and Systems'                         },
    { 'subject': 'CSIS', 'course_id': '4351', 'name': 'Human-Computer Interaction'                       },
    { 'subject': 'CSIS', 'course_id': '4501', 'name': 'Wireless Network Infrastructures'                 },
    { 'subject': 'CSIS', 'course_id': '4530', 'name': 'Database Management'                              },
    { 'subject': 'CSIS', 'course_id': '4610', 'name': 'Design and Analysis of Algorithms'                },
    { 'subject': 'CSIS', 'course_id': '4903', 'name': 'Capstone Project for Computer Science'            },
    { 'subject': 'CSIS', 'course_id': '4953', 'name': 'Capstone Internship in Computer Science'          },

    # ── TECH Core ─────────────────────────────────────────────────────────────
    { 'subject': 'TECH', 'course_id': '3300', 'name': 'System Analysis and Design'            },
    { 'subject': 'TECH', 'course_id': '3320', 'name': 'Technology Project Management'         },
    { 'subject': 'TECH', 'course_id': '4200', 'name': 'Cybersecurity Operation Management'    },
    { 'subject': 'TECH', 'course_id': '4220', 'name': 'Cybersecurity Governance'              },
    { 'subject': 'TECH', 'course_id': '4240', 'name': 'Cybersecurity Auditing'                },
    { 'subject': 'TECH', 'course_id': '4900', 'name': 'Directed Project in Information Technology' },
    { 'subject': 'TECH', 'course_id': '4950', 'name': 'Internship in Information Technology'  },

]


def seed():
    updated = 0
    added   = 0

    for c in COURSES:
        existing = Course.query.filter_by(
            subject=c['subject'],
            course_id=c['course_id']
        ).first()

        if existing:
            existing.name = c['name']
            updated += 1
        else:
            db.session.add( Course(
                subject=c['subject'],
                course_id=c['course_id'],
                name=c['name']
            ) )
            added += 1

    db.session.commit()
    print( f'Done - {added} courses added, {updated} courses updated.' )