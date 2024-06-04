
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TbArrowBack } from "react-icons/tb";


const Onboarding = () => {
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [isLoading, setIsLoading] = useState(true);
    let navigate = useNavigate();
    const logged = cookies.UserId

    // seteo el estatus inicial del form y con cookies, llamo a la propuedad UserId guardada en el cookies despues de un login
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        url: "",
        about: "",
        age: "",
        matches: []
    });

    useEffect(() => {
        const fetchData = async () => {
            if (cookies.AuthToken && cookies.UserId) {
                try {
                    const response = await axios.get('http://localhost:4000/user', {
                        params: { userId: cookies.UserId }
                    })
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [cookies]);

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()

        // Asegúrate de que matches sea un array
        if (!Array.isArray(formData.matches)) {
            formData.matches = [];
        }

        try {
            const response = await axios.put('http://localhost:4000/user', { formData })
            const success = response.status === 200
            if (success) navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }

    }

    const handleChange = (e) => {
        // hacemos este value parea el checkbox del gender
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name

        // seteo el form, con los valores que coloque en los inputs, tomo todo lo que esta
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    };

    const goBack = () => {
        navigate('/dashboard')
    }

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />
            <h2>{logged ? 'PROFILE' : ' CREATE ACCOUNT'}</h2>
            <div className="onboarding">
                <form onSubmit={handleSubmit}>
                    <section className='box-1'>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData.first_name || ""}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day || ""}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month || ""}
                                onChange={handleChange}
                            />
                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year || ""}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Man</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={handleChange}
                                checked={formData.gender_identity === "more"}
                            />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>
                        <div className='show-gender-radio'>
                            <label htmlFor="show-gender">Show Gender on my Profile</label>
                            <input
                                id="show-gender"
                                type="checkbox"
                                name="show_gender"
                                onChange={handleChange}
                                checked={formData.show_gender}
                            />
                        </div>


                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_interest === "man"}
                            />
                            <label htmlFor="man-gender-interest">Man</label>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_interest === "woman"}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData.gender_interest === "everyone"}
                            />
                            <label htmlFor="everyone-gender-interest">Everyone</label>

                        </div>

                        <label htmlFor="about">About me</label>
                        <textarea
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I like long walks..."
                            value={formData.about || ""}
                            onChange={handleChange}
                        />

                    </section>

                    <section className='box-2'>

                        <label htmlFor="url">Profile Photo</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="profile pic preview" />}
                        </div>
                    </section>
                    <div className='box-3'>
                        <button className='btn-create-acc' type="submit">{logged ? 'Save data' : 'Create account'} </button>
                        {logged ? <button className='btn-create-acc' onClick={goBack}><TbArrowBack /> </button> : ''}
                    </div>

                </form>
            </div>
        </>
    )
}
export default Onboarding