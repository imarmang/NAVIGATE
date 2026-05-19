import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { getMe, getCourses, getStudentCourses, updateStudentCourses } from '../services/api'
import StudentNavbar from '../components/navbar/StudentNavbar'
import LoadingScreen from '../components/LoadingScreen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import nsuBackground from '../assets/nsuBackground.jpeg'
import '../styles/Courses.css'

const MAX_COURSES = 6

function CoursesPage() {
    const { logout }        = useAuth()
    const navigate          = useNavigate()
    const queryClient       = useQueryClient()

    const [ enrolled, setEnrolled ]             = useState( [] )
    const [ pendingRemove, setPendingRemove ]    = useState( [] )
    const [ expandedId, setExpandedId ]         = useState( null )
    const [ hasChanges, setHasChanges ]         = useState( false )
    const [ applying, setApplying ]             = useState( false )
    const [ saved, setSaved ]                   = useState( false )
    const [ applyError, setApplyError ]         = useState( '' )

    const { data: student } = useQuery( {
        queryKey:  [ 'me' ],
        queryFn:   () => getMe().then( res => res.data ),
        staleTime: Infinity,
    } )

    const { data: allCourses = [], isLoading: loadingAll } = useQuery( {
        queryKey:  [ 'courses' ],
        queryFn:   () => getCourses().then( res => res.data ),
        staleTime: Infinity,
    } )

    const { data: myCourses = [], isLoading: loadingMine } = useQuery( {
        queryKey:  [ 'my-courses' ],
        queryFn:   () => getStudentCourses().then( res => res.data ),
        staleTime: Infinity,
    } )

    // Initialise enrolled from fetched my-courses
    useEffect( () => {
        if ( myCourses.length > 0 ) {
            setEnrolled( myCourses.map( c => c.id ) )
        }
    }, [ myCourses ] )

    const handleLogout = async () => {
        await logout()
        navigate( '/login' )
    }

    const handleStageRemove = ( id ) => {
        setPendingRemove( prev => [ ...prev, id ] )
        setHasChanges( true )
        setSaved( false )
    }

    const handleUndoRemove = ( id ) => {
        const activeCount = enrolled.filter( e => !pendingRemove.includes( e ) ).length
        if ( activeCount >= MAX_COURSES ) return
        const next = pendingRemove.filter( x => x !== id )
        setPendingRemove( next )
        if ( next.length === 0 ) setHasChanges( false )
    }

    const handleExpandCourse = ( id ) => {
        setExpandedId( prev => prev === id ? null : id )
    }

    const handleAddCourse = ( id ) => {
        if ( enrolled.filter( e => !pendingRemove.includes( e ) ).length >= MAX_COURSES ) return
        setEnrolled( prev => [ ...prev, id ] )
        setExpandedId( null )
        setHasChanges( true )
        setSaved( false )
    }

    const handleApply = async () => {
        setApplying( true )
        setApplyError( '' )
        setSaved( false )

        const updated = enrolled.filter( id => !pendingRemove.includes( id ) )

        try {
            await updateStudentCourses( { course_ids: updated } )
            await queryClient.invalidateQueries( { queryKey: [ 'my-courses' ] } )
            setEnrolled( updated )
            setPendingRemove( [] )
            setHasChanges( false )
            setSaved( true )
        } catch ( err ) {
            setApplyError( 'Failed to save changes. Please try again.' )
        } finally {
            setApplying( false )
        }
    }

    const enrolledCourses  = allCourses.filter( c => enrolled.includes( c.id ) )
    const availableCourses = allCourses.filter( c => !enrolled.includes( c.id ) )
    const activeEnrolled   = enrolledCourses.filter( c => !pendingRemove.includes( c.id ) )
    const atMax            = activeEnrolled.length >= MAX_COURSES

    if ( loadingAll || loadingMine ) return <LoadingScreen message='Loading courses...' />

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
                    { applyError && <span className='courses-hero-error'>{ applyError }</span> }
                    { saved && <span className='courses-hero-saved'>✓ Changes applied</span> }
                    <button
                        className='courses-apply-btn'
                        onClick={handleApply}
                        disabled={ !hasChanges || applying }
                    >
                        { applying ? 'Saving...' : 'Apply Changes' }
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
                                                    disabled={ enrolled.filter( e => !pendingRemove.includes( e ) ).length >= MAX_COURSES }
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