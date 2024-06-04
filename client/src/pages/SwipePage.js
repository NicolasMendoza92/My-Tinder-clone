import TinderCard from 'react-tinder-card'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import NavTinder from '../components/NavTinder'
import { FaHeart } from 'react-icons/fa';
import { MdCancel } from "react-icons/md";
import Swal from 'sweetalert2';
import useLocalStorage from '../hooks/useLocalStorage'

const SwipePage = () => {
    const [user, setUser] = useState(null);
    const [genderedUsers, setGenderedUsers] = useState(null);
    const [lastDirection, setLastDirection] = useState();
    const [filteredGenderedUsers, setFilteredGenderedUsers] = useState([]);
    const [notLikedUsers, setNotLikedUsers] = useLocalStorage('notLikedUsers', []);
    const [cookies] = useCookies(['user']);
    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:4000/user', {
                params: { userId }
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/gendered-users', {
                params: { gender: user?.gender_interest }
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

   
    const updateMatches = async (matchedUserId) => {
        // le envio dos parametros, el id del user logeado y el id del desplazado a la derecha
        try {
            await axios.put('http://localhost:4000/addmatch', {
                userId,
                matchedUserId
            })
            const response = await axios.get('http://localhost:4000/user', {
                params: { userId: matchedUserId }
            })
            const likedUserName = response.data.first_name
            const likedUserMatches =  response.data.matches || [];
            getUser();
            // Verifica si userId se encuentra en userLiked.matches
            const userIsMatched = likedUserMatches.some(match => match.user_id === userId)
            if (userIsMatched) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `You have a match! whit ${likedUserName}`,
                    showConfirmButton: false,
                    timer: 1500
                  });
            } else {
                console.log(`El usuario no matcheo`);
            }
        } catch (err) {
            console.log(err)
        }
    };

    const updateNotLiked = (notLikedUserId) => {
        setNotLikedUsers(prevNotLiked => {
            const updatedNotLiked = [...prevNotLiked, notLikedUserId];
            localStorage.setItem('notLikedUsers', JSON.stringify(updatedNotLiked));
            return updatedNotLiked;
        });
    };

    useEffect(() => {
        if (genderedUsers && user) {
            const matchedUserIds = user?.matches?.map(({ user_id }) => user_id).concat(user.userId);
            const filteredUsers = genderedUsers?.filter(genderedUser => 
                !matchedUserIds?.includes(genderedUser.user_id) &&
                !notLikedUsers?.includes(genderedUser.user_id)
            );
            setFilteredGenderedUsers(filteredUsers);
        }
    }, [genderedUsers, user, notLikedUsers]); // Se ejecuta cuando 'genderedUsers', 'user', o 'notLikedUsers' cambian

    // LOGICA PARA BOTONERAS y SWIPE 

    //  el filteredGenderedUsers se esta actualizando constantemente, y useState usa el primer estado, por eso primero me aseguro que haya algo
    const [currentIndex, setCurrentIndex] = useState(filteredGenderedUsers ? filteredGenderedUsers.length - 1 : 0)
    // used for outOfFrame closure - esto te da que tiene el array actual 
    const currentIndexRef = useRef(currentIndex)
    useEffect(() => {
        if (filteredGenderedUsers) {
            setCurrentIndex(filteredGenderedUsers.length - 1);
        }
    }, [filteredGenderedUsers]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);


    //  esto me crea un array con una longitud, dependiendo de lo que tenga 
    const childRefs = useMemo(
        () =>
            Array(filteredGenderedUsers?.length)
                .fill(0)
                .map((i) => React.createRef()),
        [filteredGenderedUsers]
    );

    // creo las condiciones, si current index es mayor a cero, puedo hacer el swipe, con el boton
    const canSwipe = currentIndex >= 0

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val)
        currentIndexRef.current = val
    }

    const swiped = (direction, swipedUserId, index) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }else {
            updateNotLiked(swipedUserId);
        }
        setLastDirection(direction)
        updateCurrentIndex(index - 1)
    }

    const outOfFrame = (name, idx) => {
        console.log(`${name} (${idx}) ' left the screen!'`)
    }

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < filteredGenderedUsers?.length) {
            await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
        } else {
            console.error("No card to swipe or invalid index");
        }
    }

    return (
        <>
            <NavTinder />
            {user &&
                <div className='swiper-container'>
                    <div className="card-container">
                        {filteredGenderedUsers?.map((genderedUser, index) =>
                            <TinderCard
                                className="swipe"
                                ref={childRefs[index]}
                                key={genderedUser.user_id}
                                preventSwipe={['up', 'down']}
                                onSwipe={(dir) => swiped(dir, genderedUser.user_id, index)}
                                onCardLeftScreen={() => outOfFrame(genderedUser.first_name, index)}>
                                <div
                                    style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
                                    className="card"
                                >
                                    <div className='card-info'>
                                        <h3>{genderedUser.first_name}</h3>
                                        <p className='age'>{genderedUser.age}</p>
                                    </div>

                                </div>
                            </TinderCard>
                        )}
                    </div>
                    <div className="swipe-info">
                        {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                    </div>
                    <div className='btns-swipe'>
                        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('left')} className='btn-swipe-next' ><MdCancel /></button>
                        <button style={{ backgroundColor: !canSwipe && '#c3c4d3' }} onClick={() => swipe('right')} className='btn-swipe-like' ><FaHeart /></button>
                    </div>
                </div>
            }
        </>
    )
}
export default SwipePage