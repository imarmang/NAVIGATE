import { useAuth } from '../hooks/useAuth.js'

import {createContext, useCallback, useEffect, useState} from "react";
import {getAppointments, getMe, getStudentCourses} from "../services/api.js";

export const DataContext = createContext()

const MINIMUM_LOADING_MS = 1500

const delay = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) )

export function DataProvider( { children } ) {
    const { registerClearCache } = useAuth()

    const [ student, setStudent ]                   = useState( null )
    const [ appointments, setAppointments ]  = useState( [] )
    const [ courses, setCourses ]            = useState( [] )
    const [ loaded, setLoaded ]            = useState( false )
    const [ loading, setLoading ]          = useState( false )

    // Fetch all data once — subsequent calls are no-ops unless force is true
    const fetchAll = useCallback( async ( force = false ) => {
        if ( loaded && !force ) return

        setLoading( true )

        try {
            const [meRes, apptRes, coursesRes ] = await Promise.all( [
                getMe(),
                getAppointments(),
                getStudentCourses(),
                delay( MINIMUM_LOADING_MS )
            ] )

            setStudent( meRes.data )
            setAppointments( apptRes.data )
            setCourses( coursesRes.data )
            setLoaded( true )
        } finally {
            setLoading( false )
        }
    }, [ loaded ] )

    // Call after creating or deleting an appointment
    const refreshAppointments = useCallback( async() => {
        const res = await getAppointments()
        setAppointments( res.data )
    }, [] )

    // resets everything back to the initial state - called by AuthContext on logout
    const clearCache = useCallback( () => {
        setStudent( null )
        setAppointments( [] )
        setCourses( [] )
        setLoaded( false )
    }, [] )

    // AuthContext needs to call clearCache when the user logs out, but clearCache lives in DataContext. They can't directly talk to each other.
    // So when DataContext first loads, it introduces itself to AuthContext:
    useEffect(() => {
        registerClearCache( clearCache )
    }, [ clearCache ] );

    return (
        <DataContext.Provider value={{
            student,
            appointments,
            courses,
            loading,
            loaded,
            fetchAll,
            refreshAppointments,
            clearCache
        }}>
            { children }
        </DataContext.Provider>
    )
}
