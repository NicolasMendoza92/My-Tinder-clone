import { useState } from "react"
import Nav from "../components/Nav";
import AuthModal from "../components/AuthModal";
import {useCookies} from "react-cookie";


const Home = () => {

    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    //  hago el llamado del token para autenticar y ejecutar las condiciones 
    // eslint-disable-next-line no-unused-vars
    const [cookies,setCookie, removeCookie] = useCookies(['user'])
    // Leo i hay un token registrado en las cookies, si es asi, lo guardo. 
    const authToken = cookies.AuthToken


    const handleClick = () => {
        // si hay token, el boton actua como sign out, sino como sign in
        if (authToken) {
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.localStorage.removeItem('notLikedUsers');
            window.location.reload()
            return
        }
        setShowModal(true)
        setIsSignUp(true)
    }

    return (
        <div className="overlay">
            <Nav
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp} />
                
            <div className="home">
                <h1 className="primary-title">Swipe Right</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? 'Singout' : 'Create Account'}
                </button>

                {showModal && (
                    <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
                )}
            </div>
        </div>

    )
}

export default Home