import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import StudentNavbar from '../components/navbar/StudentNavbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/Courses.css'

const MAX_COURSES = 6

// All available courses with hardcoded staff
const ALL_COURSES = [
    {
        id: 1, subject: 'MATH', course_id: '1200', name: 'Precalculus Algebra',
        staff: [ { name: 'Dr. James Hartwell', role: 'Professor' } ]
    },
    {
        id: 2, subject: 'MATH', course_id: '2020', name: 'Applied Statistics',
        staff: [ { name: 'Dr. James Hartwell', role: 'Professor' } ]
    },
    {
        id: 3, subject: 'MATH', course_id: '2100', name: 'Calculus I',
        staff: [
            { name: 'Dr. James Hartwell', role: 'Professor' },
            { name: 'Riley Santos',        role: 'SI'        }
        ]
    },
    {
        id: 4, subject: 'MATH', course_id: '2200', name: 'Calculus II',
        staff: [
            { name: 'Dr. James Hartwell', role: 'Professor' },
            { name: 'Riley Santos',        role: 'SI'        }
        ]
    },
    {
        id: 5, subject: 'MATH', course_id: '3300', name: 'Introductory Linear Algebra',
        staff: [ { name: 'Dr. Sarah Mitchell', role: 'Professor' } ]
    },
    {
        id: 6, subject: 'MATH', course_id: '4500', name: 'Probability and Statistics',
        staff: [ { name: 'Dr. Sarah Mitchell', role: 'Professor' } ]
    },
    {
        id: 7, subject: 'PHYS', course_id: '2400', name: 'Physics I / Lab',
        staff: [ { name: 'Dr. Sarah Mitchell', role: 'Professor' } ]
    },
    {
        id: 8, subject: 'CSIS', course_id: '1800', name: 'Introduction to Computer and Information Sciences',
        staff: [
            { name: 'Dr. Michael Torres', role: 'Professor' },
            { name: 'Casey Morgan',       role: 'SI'        }
        ]
    },
    {
        id: 9, subject: 'CSIS', course_id: '2000', name: 'Introduction to Database Systems',
        staff: [
            { name: 'Dr. Michael Torres', role: 'Professor' },
            { name: 'Quinn Martinez',     role: 'SI'        }
        ]
    },
    {
        id: 10, subject: 'CSIS', course_id: '2050', name: 'Discrete Mathematics',
        staff: [ { name: 'Dr. Michael Torres', role: 'Professor' } ]
    },
    {
        id: 11, subject: 'CSIS', course_id: '2101', name: 'Fundamentals of Computer Programming',
        staff: [
            { name: 'Dr. Michael Torres', role: 'Professor' },
            { name: 'Casey Morgan',       role: 'SI'        }
        ]
    },
    {
        id: 12, subject: 'CSIS', course_id: '3001', name: 'Introduction to Cybersecurity',
        staff: [ { name: 'Dr. Elena Vasquez', role: 'Professor' } ]
    },
    {
        id: 13, subject: 'CSIS', course_id: '3020', name: 'Web Programming and Design',
        staff: [
            { name: 'Dr. Priya Sharma',   role: 'Professor' },
            { name: 'Dakota Williams',    role: 'SI'        }
        ]
    },
    {
        id: 14, subject: 'CSIS', course_id: '3023', name: 'Legal and Ethical Aspects of Computers',
        staff: [ { name: 'Dr. Thomas Wright', role: 'Professor' } ]
    },
    {
        id: 15, subject: 'CSIS', course_id: '3051', name: 'Computer Organization and Architecture',
        staff: [
            { name: 'Dr. David Okonkwo', role: 'Professor' },
            { name: 'Jamie Rivera',      role: 'SI'        }
        ]
    },
    {
        id: 16, subject: 'CSIS', course_id: '3101', name: 'Advanced Computer Programming',
        staff: [
            { name: 'Dr. Robert Leinecker', role: 'Professor' },
            { name: 'Cameron Foster',       role: 'SI'        }
        ]
    },
    {
        id: 17, subject: 'CSIS', course_id: '3200', name: 'Organization of Programming Languages',
        staff: [
            { name: 'Dr. Robert Leinecker', role: 'Professor' },
            { name: 'Cameron Foster',       role: 'SI'        }
        ]
    },
    {
        id: 18, subject: 'CSIS', course_id: '3400', name: 'Data Structures',
        staff: [
            { name: 'Dr. Robert Leinecker', role: 'Professor' },
            { name: 'Taylor Brooks',        role: 'SI'        }
        ]
    },
    {
        id: 19, subject: 'CSIS', course_id: '3460', name: 'Object-Oriented Design',
        staff: [
            { name: 'Dr. Robert Leinecker', role: 'Professor' },
            { name: 'Taylor Brooks',        role: 'SI'        }
        ]
    },
    {
        id: 20, subject: 'CSIS', course_id: '3500', name: 'Networks and Data Communication',
        staff: [
            { name: 'Dr. Elena Vasquez', role: 'Professor' },
            { name: 'Jordan Kim',        role: 'SI'        }
        ]
    },
    {
        id: 21, subject: 'CSIS', course_id: '3530', name: 'Artificial Intelligence',
        staff: [
            { name: 'Dr. Linda Chen',  role: 'Professor' },
            { name: 'Avery Johnson',   role: 'SI'        }
        ]
    },
    {
        id: 22, subject: 'CSIS', course_id: '3610', name: 'Numerical Analysis',
        staff: [ { name: 'Dr. Linda Chen', role: 'Professor' } ]
    },
    {
        id: 23, subject: 'CSIS', course_id: '3750', name: 'Software Engineering',
        staff: [ { name: 'Dr. David Okonkwo', role: 'Professor' } ]
    },
    {
        id: 24, subject: 'CSIS', course_id: '3810', name: 'Operating Systems Concepts',
        staff: [
            { name: 'Dr. David Okonkwo', role: 'Professor' },
            { name: 'Jamie Rivera',      role: 'SI'        }
        ]
    },
    {
        id: 25, subject: 'CSIS', course_id: '4010', name: 'Computer Security',
        staff: [
            { name: 'Dr. Elena Vasquez', role: 'Professor' },
            { name: 'Jordan Kim',        role: 'SI'        }
        ]
    },
    {
        id: 26, subject: 'CSIS', course_id: '4311', name: 'Web Services and Systems',
        staff: [
            { name: 'Dr. Priya Sharma',  role: 'Professor' },
            { name: 'Dakota Williams',   role: 'SI'        }
        ]
    },
    {
        id: 27, subject: 'CSIS', course_id: '4351', name: 'Human-Computer Interaction',
        staff: [ { name: 'Dr. Priya Sharma', role: 'Professor' } ]
    },
    {
        id: 28, subject: 'CSIS', course_id: '4501', name: 'Wireless Network Infrastructures',
        staff: [ { name: 'Dr. Elena Vasquez', role: 'Professor' } ]
    },
    {
        id: 29, subject: 'CSIS', course_id: '4530', name: 'Database Management',
        staff: [
            { name: 'Dr. Priya Sharma',  role: 'Professor' },
            { name: 'Quinn Martinez',    role: 'SI'        }
        ]
    },
    {
        id: 30, subject: 'CSIS', course_id: '4610', name: 'Design and Analysis of Algorithms',
        staff: [
            { name: 'Dr. Linda Chen',  role: 'Professor' },
            { name: 'Avery Johnson',   role: 'SI'        }
        ]
    },
    {
        id: 31, subject: 'CSIS', course_id: '4903', name: 'Capstone Project for Computer Science',
        staff: [ { name: 'Dr. Thomas Wright', role: 'Professor' } ]
    },
    {
        id: 32, subject: 'CSIS', course_id: '4953', name: 'Capstone Internship in Computer Science',
        staff: [ { name: 'Dr. Thomas Wright', role: 'Professor' } ]
    },
    {
        id: 33, subject: 'TECH', course_id: '3300', name: 'System Analysis and Design',
        staff: [
            { name: 'Dr. Maria Castillo', role: 'Professor' },
            { name: 'Blake Anderson',     role: 'SI'        }
        ]
    },
    {
        id: 34, subject: 'TECH', course_id: '3320', name: 'Technology Project Management',
        staff: [
            { name: 'Dr. Maria Castillo', role: 'Professor' },
            { name: 'Blake Anderson',     role: 'SI'        }
        ]
    },
    {
        id: 35, subject: 'TECH', course_id: '4200', name: 'Cybersecurity Operation Management',
        staff: [ { name: 'Dr. Maria Castillo', role: 'Professor' } ]
    },
    {
        id: 36, subject: 'TECH', course_id: '4220', name: 'Cybersecurity Governance',
        staff: [ { name: 'Dr. Maria Castillo', role: 'Professor' } ]
    },
    {
        id: 37, subject: 'TECH', course_id: '4240', name: 'Cybersecurity Auditing',
        staff: [ { name: 'Dr. Maria Castillo', role: 'Professor' } ]
    },
    {
        id: 38, subject: 'TECH', course_id: '4900', name: 'Directed Project in Information Technology',
        staff: [ { name: 'Dr. Thomas Wright', role: 'Professor' } ]
    },
    {
        id: 39, subject: 'TECH', course_id: '4950', name: 'Internship in Information Technology',
        staff: [ { name: 'Dr. Thomas Wright', role: 'Professor' } ]
    },
]

function CoursesPage() {
    const { logout }                                = useAuth()
    const { student, courses: contextCourses }      = useData()
    const navigate                                  = useNavigate()

    // Seed initial enrolled from DataContext course ids
    const initialEnrolled = contextCourses.map( c => c.id )

    const [ enrolled, setEnrolled ]                 = useState( initialEnrolled )
    const [ pendingRemove, setPendingRemove ]        = useState( [] ) // staged for removal
    const [ expandedId, setExpandedId ]             = useState( null ) // right col expanded
    const [ hasChanges, setHasChanges ]             = useState( false )
    const [ saved, setSaved ]                       = useState( false )

    const handleLogout = async () => {
        await logout()
        navigate( '/login' )
    }

    // Stage a removal — grey it out until Apply
    const handleStageRemove = ( id ) => {
        setPendingRemove( prev => [ ...prev, id ] )
        setHasChanges( true )
        setSaved( false )
    }

    // Undo a staged removal
    const handleUndoRemove = ( id ) => {
        const next = pendingRemove.filter( x => x !== id )
        setPendingRemove( next )
        if ( next.length === 0 && !hasChanges ) setHasChanges( false )
    }

    // Expand a course on the right to show staff + confirm button
    const handleExpandCourse = ( id ) => {
        setExpandedId( prev => prev === id ? null : id )
    }

    // Add a course from the right column
    const handleAddCourse = ( id ) => {
        if ( enrolled.filter( e => !pendingRemove.includes( e ) ).length >= MAX_COURSES ) return
        setEnrolled( prev => [ ...prev, id ] )
        setExpandedId( null )
        setHasChanges( true )
        setSaved( false )
    }

    // Apply all changes
    const handleApply = () => {
        const updated = enrolled.filter( id => !pendingRemove.includes( id ) )
        setEnrolled( updated )
        setPendingRemove( [] )
        setHasChanges( false )
        setSaved( true )
    }

    const enrolledCourses  = ALL_COURSES.filter( c => enrolled.includes( c.id ) )
    const availableCourses = ALL_COURSES.filter( c => !enrolled.includes( c.id ) )
    const activeEnrolled   = enrolledCourses.filter( c => !pendingRemove.includes( c.id ) )
    const atMax            = activeEnrolled.length >= MAX_COURSES

    return (
        <div className='courses-wrapper'>
            <StudentNavbar student={student} onLogout={handleLogout} />

            {/* Hero */}
            <div
                className='courses-hero'
                style={{ backgroundImage: `url(${ nsuBackground })` }}
            >
                <div className='courses-hero-overlay' />
                <div className='courses-hero-content'>
                    <h1 className='courses-hero-title'>Courses</h1>
                    <p className='courses-hero-sub'>
                        { activeEnrolled.length } of { MAX_COURSES } enrolled
                        { atMax && <span className='courses-hero-max'> · Maximum reached</span> }
                    </p>
                </div>
                <div className='courses-hero-actions'>
                    { saved && <span className='courses-hero-saved'>✓ Changes applied</span> }
                    <button
                        className='courses-apply-btn'
                        onClick={handleApply}
                        disabled={ !hasChanges }
                    >
                        Apply Changes
                    </button>
                </div>
            </div>

            <div className='courses-content'>
                <div className='courses-grid'>

                    {/* Left — Enrolled */}
                    <div>
                        <h2 className='courses-col-title'>Enrolled</h2>
                        { enrolledCourses.length === 0 ? (
                            <div className='courses-empty'>
                                <p>No courses enrolled yet.</p>
                                <p className='courses-empty-hint'>Add courses from the right.</p>
                            </div>
                        ) : (
                            <div className='courses-list'>
                                { enrolledCourses.map( course => {
                                    const staged = pendingRemove.includes( course.id )
                                    return (
                                        <div
                                            key={course.id}
                                            className={`course-card enrolled ${ staged ? 'staged-remove' : '' }`}
                                        >
                                            <div className='course-card-badge'>
                                                { course.subject.slice( 0, 3 ) }
                                            </div>
                                            <div className='course-card-info'>
                                                <p className='course-card-code'>{ course.subject } { course.course_id }</p>
                                                <p className='course-card-name'>{ course.name }</p>
                                            </div>
                                            { staged ? (
                                                <button
                                                    className='course-card-undo'
                                                    onClick={ () => handleUndoRemove( course.id ) }
                                                    title='Undo remove'
                                                >
                                                    Undo
                                                </button>
                                            ) : (
                                                <button
                                                    className='course-card-btn remove'
                                                    onClick={ () => handleStageRemove( course.id ) }
                                                    title='Remove course'
                                                >
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            ) }
                                        </div>
                                    )
                                } ) }
                            </div>
                        ) }
                    </div>

                    {/* Right — Available */}
                    <div>
                        <h2 className='courses-col-title'>
                            Available
                            { atMax && <span className='courses-col-max'> — remove a course to add more</span> }
                        </h2>
                        { availableCourses.length === 0 ? (
                            <div className='courses-empty'>
                                <p>You're enrolled in all available courses.</p>
                            </div>
                        ) : (
                            <div className='courses-list'>
                                { availableCourses.map( course => {
                                    const isExpanded = expandedId === course.id
                                    return (
                                        <div
                                            key={course.id}
                                            className={`course-card available ${ isExpanded ? 'expanded' : '' } ${ atMax ? 'disabled' : '' }`}
                                            onClick={ () => !atMax && handleExpandCourse( course.id ) }
                                        >
                                            <div className='course-card-badge available'>
                                                { course.subject.slice( 0, 3 ) }
                                            </div>
                                            <div className='course-card-info'>
                                                <p className='course-card-code'>{ course.subject } { course.course_id }</p>
                                                <p className='course-card-name'>{ course.name }</p>

                                                {/* Expanded staff */}
                                                { isExpanded && (
                                                    <div className='course-card-expanded'>
                                                        <div className='course-staff-list'>
                                                            { course.staff.map( ( s, i ) => (
                                                                <span
                                                                    key={i}
                                                                    className={`course-staff-badge ${ s.role === 'SI' ? 'si' : 'prof' }`}
                                                                >
                                                                    { s.name } · { s.role }
                                                                </span>
                                                            ) ) }
                                                        </div>
                                                    </div>
                                                ) }
                                            </div>
                                            { isExpanded && (
                                                <button
                                                    className='course-card-btn add'
                                                    onClick={ ( e ) => { e.stopPropagation(); handleAddCourse( course.id ) } }
                                                    title='Add course'
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                            ) }
                                        </div>
                                    )
                                } ) }
                            </div>
                        ) }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CoursesPage