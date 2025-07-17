import {useState, useEffect} from "react";

const FishCard = ({name, image, family}) => {
    return (
        <>
            <div className="fishcard">
                <p>{name}</p>
                <p>{family}</p>
            </div>
        </>
    )
}

export default FishCard