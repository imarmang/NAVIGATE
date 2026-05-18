import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { getCourses, updateStudentCourses } from '../services/api'
import StudentNavbar from '../components/navbar/StudentNavbar'
import LoadingScreen from '../components/LoadingScreen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faPlus, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import '../styles/Courses.css'

function CoursesPage() {
    const { logout }                                        = useAuth()
    const { student, courses, loading, fetchAll,
            refreshCourses }                                = useData()
    const navigate                                          = useNavigate()

    const [ allCourses, setAllCourses ]                     = useState( [] )
    const [ enrolled, setEnrolled ]                         = useState( [] )
    const [ loadingCourses, setLoadingCourses ]             = useState( true )
    const [ saving, setSaving ]                             = useState( false )
    const [ saved, setSaved ]                               = useState( false )
    const [ error, setError ]                               = useState( '' )
    const [ hasChanges, setHasChanges ]                     = useState( false )

    useEffect( () => {
        fetchAll().catch( () => {
            logout()
            navigate( '/login' )
        } )
    }, [] )

    // Populate enrolled from DataContext courses
    useEffect( () => {
        if ( courses.length >= 0 ) {
            setEnrolled( courses.map( c => c.id ) )
        }
    }, [ courses ] )

    // Fetch all available courses
    useEffect( () => {
        getCourses()
            .then( res => setAllCourses( res.data ) )
            .catch( () => setError( 'Failed to load courses' ) )
            .finally( () => setLoadingCourses( false ) )
    }, [] )

    const handleLogout = async () => {
        await logout()
        navigate( '/login' )
    }

    const handleAdd = ( courseId ) => {
        if ( enrolled.includes( courseId ) ) return
        setEnrolled( prev => [ ...prev, courseId ] )
        setHasChanges( true )
        setSaved( false )
    }

    const handleRemove = ( courseId ) => {
        setEnrolled( prev => prev.filter( id => id !== courseId ) )
        setHasChanges( true )
        setSaved( false )
    }

    const handleSave = async () => {
        setSaving( true )
        setError( '' )
        setSaved( false )

        try {
            await updateStudentCourses( { course_ids: enrolled } )
            await refreshCourses()
            setSaved( true )
            setHasChanges( false )
        } catch ( err ) {
            setError( 'Failed to save courses. Please try again.' )
        } finally {
            setSaving( false )
        }
    }

    const enrolledCourses     = allCourses.filter( c => enrolled.includes( c.id ) )
    const availableCourses    = allCourses.filter( c => !enrolled.includes( c.id ) )

    if ( loading || loadingCourses ) return <LoadingScreen message='Loading courses...' />

    return (
        <div className='courses-wrapper'>
            <StudentNavbar student={student} onLogout={handleLogout} />

            <div className='courses-content'>

                {/* Header */}
                <div className='courses-header'>
                    <div>
                        <h1 className='courses-title'>My Courses</h1>
                        <p className='courses-subtitle'>
                            { enrolledCourses.length } enrolled · { availableCourses.length } available
                        </p>
                    </div>
                    <div className='courses-header-actions'>
                        { error  && <p className='courses-error'>{ error }</p> }
                        { saved  && <p className='courses-saved'><FontAwesomeIcon icon={faCheck} /> Saved</p> }
                        <button
                            className='courses-save-btn'
                            onClick={handleSave}
                            disabled={ !hasChanges || saving }
                        >
                            { saving ? 'Saving...' : 'Save Changes' }
                        </button>
                    </div>
                </div>

                <div className='courses-grid'>

                    {/* Enrolled courses */}
                    <div className='courses-card'>
                        <h2 className='courses-card-title'>Enrolled</h2>
                        { enrolledCourses.length === 0 ? (
                            <div className='courses-empty'>
                                <FontAwesomeIcon icon={faBookOpen} className='courses-empty-icon' />
                                <p>No courses enrolled yet.</p>
                                <p className='courses-empty-hint'>Add courses from the list on the right.</p>
                            </div>
                        ) : (
                            <div className='courses-list'>
                                { enrolledCourses.map( course => (
                                    <div key={course.id} className='course-item enrolled'>
                                        <div className='course-item-icon'>
                                            { course.subject.slice( 0, 3 ) }
                                        </div>
                                        <div className='course-item-info'>
                                            <p className='course-item-name'>{ course.subject } { course.course_id }</p>
                                        </div>
                                        <button
                                            className='course-item-btn remove'
                                            onClick={ () => handleRemove( course.id ) }
                                            title='Remove course'
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ) ) }
                            </div>
                        ) }
                    </div>

                    {/* Available courses */}
                    <div className='courses-card'>
                        <h2 className='courses-card-title'>Available</h2>
                        { availableCourses.length === 0 ? (
                            <div className='courses-empty'>
                                <FontAwesomeIcon icon={faCheck} className='courses-empty-icon' />
                                <p>You're enrolled in all available courses.</p>
                            </div>
                        ) : (
                            <div className='courses-list'>
                                { availableCourses.map( course => (
                                    <div key={course.id} className='course-item available'>
                                        <div className='course-item-icon available'>
                                            { course.subject.slice( 0, 3 ) }
                                        </div>
                                        <div className='course-item-info'>
                                            <p className='course-item-name'>{ course.subject } { course.course_id }</p>
                                        </div>
                                        <button
                                            className='course-item-btn add'
                                            onClick={ () => handleAdd( course.id ) }
                                            title='Add course'
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                ) ) }
                            </div>
                        ) }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CoursesPage