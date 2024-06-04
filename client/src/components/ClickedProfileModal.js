import React from 'react'

const ClickedProfileModal = ({ setShowModal, clickedUser }) => {

    const handleClick = () => {
        setShowModal(false)
    };

    return (
        <div className="card-profile">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>
            <img src={clickedUser?.url} alt="profile pic preview" className="card-image-profile" />
            <div className="card-content-profile">
                <h2 className="card-title-profile"> {clickedUser?.first_name}</h2>
                <p>{clickedUser?.email}</p>
                <div className="multiple-input-container">
                    <p>Birthday: {clickedUser?.dob_day} - {clickedUser?.dob_month} - {clickedUser?.dob_year}  </p>
                </div>
                <div className="multiple-input-container">
                    <p>Age: {clickedUser?.age} </p>
                </div>
                <div className="multiple-input-container">
                    <p>Gender: {clickedUser?.gender_identity}</p>
                </div>
                <div className="multiple-input-container">
                    <p>Looking for: {clickedUser?.gender_interest}</p>
                </div>
                <p className="card-description-profile">{clickedUser?.about}</p>
            </div>
        </div>
    )
}

export default ClickedProfileModal