import '../styles/LoadingScreen.css'

function LoadingScreen( { message = 'Loading...' } ) {
    return (
        <div className='loading-screen'>
            <div className='loading-content'>
                <div className='loading-logo'>N.A.V.I.G.A.T.E.</div>
                <div className='loading-spinner'>
                    <div className='loading-spinner-ring' />
                </div>
                <p className='loading-text'>{ message }</p>
            </div>
        </div>
    )
}

export default LoadingScreen