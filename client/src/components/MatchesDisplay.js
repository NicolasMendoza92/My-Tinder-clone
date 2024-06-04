import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const MatchesDisplay = ({ matches, setClickedUser }) => {

    const [cookies] = useCookies(null);
    // Traigo el userId del usuario logeado en el momento
    const userId = cookies.UserId;
    // Busco los id de los usuarios que machearon y los guardo en un array
    const matchedUserIds = matches?.map(({ user_id }) => user_id);

    const [matchedProfiles, setMatchedProfiles] = useState([]);  

    const getMatches = async () => {
        try {
            const response = await axios.get("http://localhost:4000/users", {
                params: { userIds: JSON.stringify(matchedUserIds) },
            });
            setMatchedProfiles(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMatches();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


     // Función para filtrar los perfiles coincidentes
     const filteredMatchedProfiles = matchedProfiles?.filter((matchedProfile) => {
        return matchedProfile?.matches?.filter((profile) => profile.user_id === userId).length > 0;
    });

    return (
        <div className="matches-display">
            {filteredMatchedProfiles?.map((match, _index) => (
                <div
                    key={_index}
                    className="match-card"
                    onClick={() => setClickedUser(match)}
                >
                    <div className="img-container">
                        <img src={match?.url} alt={match?.first_name + " profile"} />
                    </div>
                    <h3>{match?.first_name}</h3>
                </div>
            ))}
        </div>
    );
};

export default MatchesDisplay;