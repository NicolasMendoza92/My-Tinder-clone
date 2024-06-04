import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';


const AuthModal = ({ setShowModal, isSignUp }) => {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(['user'])

    let navigate = useNavigate()

    const handleClick = () => {
        setShowModal(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('Password need to match')
                return
            }
            // condiciono la ruta, dependiendo de lo que tenga en el estado isSignUp
            const response = await axios.post(`http://localhost:4000/${isSignUp ? 'signup' : 'login'}`, { email, password });

            // Hago uso de la libreria react-cookie para guardar los datos en las cookies, con los nombres que estan entre comillas, luego los llamare
            setCookie('UserId', response.data.userId);
            setCookie('AuthToken', response.data.token);

            const success = response.status === 201
            if (success && isSignUp) {
                navigate('/onboarding')
            }
            else if (success && !isSignUp) {
                navigate('/dashboard')
            } else{
                setError(response.data || 'Something went wrong');
            }
            window.location.reload()

        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data || 'An error occurred');
            } else {
                setError('An error occurred');
            }
           
        }

    };

    return (
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>

            <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
            <p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)} />
                {isSignUp &&
                    <input
                        type="password"
                        id="password-check"
                        name="password-check"
                        placeholder="confirm password"
                        required={true}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                }
                <button className="secondary-button" type="submit">{isSignUp ? 'SIGN IN' : 'ENTER'}</button>
                <p className="error-div">{error}</p>
            </form>

            <hr />
            
            <h2> GET THE APP</h2>
        </div>
    )
}

export default AuthModal
