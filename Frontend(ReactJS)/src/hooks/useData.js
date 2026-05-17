import { useContext } from 'react'
import { DataContext } from '../context/DataContext.jsx'

export function useData() {
    return useContext( DataContext )
}