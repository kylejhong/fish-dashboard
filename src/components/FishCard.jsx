import {useState, useEffect} from "react";
import { Link } from "react-router-dom";

const FishCard = ({name, image, family, status}) => {
    return (
        <div>
            <Link
                style={{ color: "rgb(40, 53, 66)" }}
                to={`/fishDetails/${name}`}
            >
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
            </Link>
        </div>
    )
}

export default FishCard