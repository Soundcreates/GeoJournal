import { MapContainer, TileLayer } from "react-leaflet";
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { fetchStuff } from "../service/api.js";
import OtherUserCard from "../comps/OtherUserCard.jsx";


export function Others() {
    const position = [19.2183, 72.9781]; //example coordinates for thane india
    const [otherUsers, setOtherUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetchStuff.get('/users/getOtherUsers', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.status === 200) {
                    console.log(response.data.users);
                    setOtherUsers(response.data.users);

                }

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchUsers();
    }, [])
    return (
        <div className=" w-screen h-screen bg-[#0F1727] flex ">
            {/*View others div*/}

            <div className="w-[50%] h-full flex flex-col p-10 ">
                <h1 className="text-4xl text-white ">Here are many people travelling the world!</h1>
                <div className="grid grid-cols-2 gap-10  p-10">
                    {
                        otherUsers.map(user => <OtherUserCard user={user} key={user.id} />)
                    }
                </div>

            </div>

            {/*MapContainer Div*/}
            <div className="w-[50%] h-full">
                <MapContainer center={position} zoom={13} className="w-full h-full ">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </div>
    )
}