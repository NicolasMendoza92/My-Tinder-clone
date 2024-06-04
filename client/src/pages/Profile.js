import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import Nav from '../components/Nav';

const Profile = () => {

    const [cookies] = useCookies(['user']);
    const userId = cookies.UserId;
    const [userLogged, setUserLogged] = useState(null);

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:4000/user', {
                params: { userId }
            })
            setUserLogged(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />
            <div className="container_profile">
                <div className="card-profile">
                    <img src={userLogged?.url} alt="profile pic preview" className="card-image-profile" />
                    <div className="card-content-profile">
                        <h2 className="card-title-profile"> {userLogged?.first_name}</h2>
                        <p>{userLogged?.email}</p>
                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <p> {userLogged?.dob_day} - {userLogged?.dob_month} - {userLogged?.dob_year}  </p>
                        </div>
                        <div className="multiple-input-container">
                            <p>Age: {userLogged?.age}</p>
                        </div>
                        <div className="multiple-input-container">
                            <p>Gender: {userLogged?.gender_identity}</p>
                        </div>
                        <p>Show Gender on my Profile: {userLogged?.show_gender ? 'Yes' : 'No'}</p>
                        <div className="multiple-input-container">
                            <p>Show Me: {userLogged?.gender_interest}</p>
                        </div>
                        <p className="card-description-profile">{userLogged?.about}</p>
                    </div>
                </div>
            </div>
        </ >
    )
}

export default Profile