import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { FaAddressCard, FaSignOutAlt } from 'react-icons/fa';
import { SiTinder } from "react-icons/si";

const ChatHeader = ({ user }) => {

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    let navigate = useNavigate()

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        window.localStorage.removeItem('notLikedUsers');
        navigate('/')
    }

    function goToProfile() {
        navigate('/onboarding')
    }
    function goSwipe() {
        navigate('/swipepage')
    }
    function goToCard() {
        navigate('/profile')
    }

    return (
        <div className="chat-container-header">
            <div className="profile" onClick={goToProfile}>
                <div className="img-container">
                    <img src={user?.url} alt={"photo of " + user?.first_name} />
                </div>
                <h3>{user?.first_name}</h3>
            </div>
            <div className="wrapp-profile-btns">
                <i className="log-out-icon" onClick={goSwipe}><SiTinder /></i>
                <i className="log-out-icon" onClick={goToCard}><FaAddressCard /></i>
                <i className="log-out-icon" onClick={logout}><FaSignOutAlt /></i>
            </div>
        </div>
    )
}

export default ChatHeader