import FishCard from '../components/FishCard';
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const API_KEY = import.meta.env.VITE_APP_API_KEY

const DetailView = () => {
    const { name } = useParams()

    const [details, setDetails] = useState(null)

    const url = `https://fish-species.p.rapidapi.com/fish_api/fish/${name}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'fish-species.p.rapidapi.com'
        }
    };

    useEffect(() => {
        const getFish = async () => {
            const response = await fetch(url, options);
            const json = await response.json();
            if (json) {
                console.log(json[0]);
                setDetails(json[0]);
            } else {
                console.log("Nothing returned.");
            }
        }

        getFish().catch(console.error)
    }, [name])

    return (
        <>
            <div className="statistics">
                <img className="random-image-detail" src={details?.img_src_set["1.5x"]}/>
                <div className="card">
                <h1>{details?.name}</h1>
                <p>Family - {details?.meta.scientific_classification.family
                        .replace(",_", ", ")
                        .replace(/^./, c => c.toUpperCase())
                    }</p>
                </div>
            </div>
            <div className="list list-detail">
                <div className="fishcard-detail">
                    <div>
                        <p>Conservation Status -</p>
                        <p>{details?.meta.conservation_status}</p>
                    </div>
                    {details?.meta.binomial_name && (
                        <div>
                            <p>Binomial Name -</p>
                            <p>{details.meta.binomial_name}</p>
                        </div>
                    )}
                    {details?.meta.scientific_classification.class && (
                        <div>
                            <p>Class -</p>
                            <p>{details.meta.scientific_classification.class}</p>
                        </div>
                    )}
                    {details?.meta.scientific_classification.species && (
                        <div>
                            <p>Species -</p>
                            <p>{details.meta.scientific_classification.species}</p>
                        </div>
                    )}
                    {details?.meta.scientific_classification.order && (
                        <div>
                            <p>Order -</p>
                            <p>{details.meta.scientific_classification.order}</p>
                        </div>
                    )}

                    {details?.meta.synonyms && (
                        <div>
                            <p>Synonyms -</p>
                            <p>{details.meta.synonyms}</p>
                        </div>
                    )}

                    
                </div>
                
            </div>
        </>
        
    )
}

export default DetailView