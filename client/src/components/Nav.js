import whiteLogo from '../components/images/tinder_logo_white.png'
import colorLogo from '../components/images/color-logo-tinder.png'
import { useNavigate } from 'react-router-dom';


const Nav = ({ minimal, setShowModal, showModal, setIsSignUp, authToken}) => {

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    };

    const goToDashboard = () => {
        navigate('/dashboard')
    }

    const goHome = () => {
        navigate('/')
    }

    return (
        <nav>
            <div className="logo-container">
                <img onClick={goHome} alt='logo' className="logo" src={minimal ? colorLogo : whiteLogo} />
            </div>
            {!authToken && !minimal &&
                <button className='nav-button' onClick={handleClick} disabled={showModal}>
                    Log in
                </button>
            }
            {authToken &&
                <button className='nav-button' onClick={goToDashboard}>
                    Dashboard
                </button>
            }
        </nav>
    )
}

export default Nav