import {useState, useEffect} from "react";

const FishCard = ({name, image, family, status}) => {
    return (
        <div>
            <div className="fishcard">
                <img src={image}/>
                <div>
                    <p>Name</p>
                    <p>{name}</p>
                </div>
                <div>
                    <p>Family</p>
                    <p>{family}</p>
                </div>
                <div>
                    <p>Conservation Status</p>
                    <p>{status}</p>
                </div>
            </div>
        </div>
    )
}

export default FishCard