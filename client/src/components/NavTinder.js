import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoIosChatboxes } from "react-icons/io"


const NavTinder = () => {

    return (
        <div className="header">
            <Link className='header-icon' to="/profile">
                <FaUser />
            </Link>
            <Link to="/">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJm9bUsk5L6fBkiOUGSDv9FBOKDZfVeYHJdw&usqp=CAU"
                    className="header-logo"
                    alt="logo" />
            </Link>
            <Link className='header-icon' to="/dashboard">
                <IoIosChatboxes/>
            </Link>
        </div>
    )
}

export default NavTinder