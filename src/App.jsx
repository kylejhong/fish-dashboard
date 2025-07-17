import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import jsonData from './data.json'
import FishCard from './components/FishCard';
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY

const url = 'https://fish-species.p.rapidapi.com/fish_api/fishes';

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': API_KEY,
		'x-rapidapi-host': 'fish-species.p.rapidapi.com'
	}
};

function App() {
  const [data, setData] = useState(jsonData)

  useEffect(() => {
    const requestAPI = async () => {
      const response = await fetch(url, options);
      const json = await response.json();
      if (json) {
        setData(json);
        console.log(json);
      } else {
        alert("Nothing returned.");
      }
    }
    //requestAPI().catch(console.error);
  }, [])

  return (
    <>
      <div className="main-content">
        <div className="background-image"></div>
        <div className="container">
          <div className="header">
            <div>Fish Finder</div>
            <div>Dashboard</div>
            <div>Dashboard</div>
          </div>
          <div className="statistics">
            <div className="random-image">
              <div className="random-image-bkg"></div>
            </div>
            <div className="card">
              <h1>08</h1>
              <p>Total Fish</p>
            </div>
            <div className="card">
              <h1>08</h1>
              <p>Statistic!</p>
            </div>
            <div className="card">
              <h1>08</h1>
              <p>Statistic!</p>
            </div>
          </div>
          <div className="list">
            <div className="random-image-bkg-list"></div>
            {data && data.length > 0 ? (
              Object.values(data)
                .map((key) => (
                  <FishCard 
                    key={key.id}
                    name={key.name}
                    image={key.img_src_set}
                    family={key.meta?.scientific_classification?.family}
                  />
                ))
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
