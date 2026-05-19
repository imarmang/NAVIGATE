import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import StudentNavbar from '../components/navbar/StudentNavbar'
import { useEffect, useState } from 'react'
import { getCourses } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/Courses.css'
import LoadingScreen from "../components/LoadingScreen.jsx";

const MAX_COURSES = 6


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
    const [ allCourses, setAllCourses ] = useState( [] )
    const [ loadingCourses, setLoadingCourses ] = useState( true )

    useEffect( () => {
        getCourses()
            .then( res => {
                console.log( 'Courses from API:', res.data )
                setAllCourses( res.data )
            } )
            .catch( err => console.error( 'Failed to load courses:', err ) )
            .finally( () => setLoadingCourses( false ) )
    }, [] )

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

    const enrolledCourses  = allCourses.filter( c => enrolled.includes( c.id ) )
    const availableCourses = allCourses.filter( c => !enrolled.includes( c.id ) )
    const activeEnrolled   = enrolledCourses.filter( c => !pendingRemove.includes( c.id ) )
    const atMax            = activeEnrolled.length >= MAX_COURSES

    if ( loadingCourses ) return <LoadingScreen message='Loading courses...' />

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
                                                            { ( course.staff ?? [] ).map( ( s, i ) => (
                                                                <span
                                                                    key={i}
                                                                    className={`course-staff-badge ${ s.role === 'SI' ? 'si' : 'prof' }`}
                                                                >
                                                                    { s.first_name } { s.last_name } · { s.role }
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