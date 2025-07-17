import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import jsonData from './data.json'
import FishCard from './components/FishCard';
import { IoSearch, IoCaretDown } from "react-icons/io5";

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
  const [data, setData] = useState(null)
  const [searchFilteredResults, setSearchFilteredResults] = useState(null)
  const [filteredResults, setFilteredResults] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState('all');
  const [uniqueFamilies, setUniqueFamilies] = useState(0);
  const [commonFamily, setCommonFamily] = useState("");

  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchValue !== "") {
      setSearchFilteredResults(
        data.filter((fish) => {
          return Object.values(fish)
            .join("")
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        })
      );
      console.log(searchFilteredResults)
    } else {
      setSearchFilteredResults(data);
    }
  }

  const filterItems = () => {
    if (searchFilteredResults) {
      setFilteredResults(
        searchFilteredResults.filter((fish) => {
          if (statusFilter === 'all') return true;
        
          if (statusFilter === 'least_concern') {
            return (
              fish.meta.conservation_status.includes("Least Concern") ||
              fish.meta.conservation_status.includes("Secure")
            );
          }

          if (statusFilter === 'cites_listed') {
            return (
              fish.meta.conservation_status.includes("CITES")
            );
          }

          if (statusFilter === 'near_threatened') {
            return (
              fish.meta.conservation_status.includes("Near")
            );
          }

          if (statusFilter === 'vulnerable') {
            return (
              fish.meta.conservation_status.includes("Vul")
            );
          }

          if (statusFilter === 'endangered') {
            return (
              fish.meta.conservation_status.includes("Endangered") && !fish.meta.conservation_status.includes("Critically Endangered")
            );
          }

          if (statusFilter === 'critically_endangered') {
            return (
              fish.meta.conservation_status.includes("Critically Endangered")
            );
          }

          if (statusFilter === 'extinct') {
            return (
              fish.meta.conservation_status.includes("Extinct")
            );
          }

          if (statusFilter === 'data_deficient') {
            return (
              fish.meta.conservation_status.includes("Data")
            );
          }
        })
      );
    }
  }

  const updateStats = () => {
    if (filteredResults) {
      const familyArray = filteredResults.map(fish => fish.meta?.scientific_classification?.family)

      const frequencyMap = {};
      let mostFrequentElement = familyArray[0];
      let maxCount = 0;

      for (const family of familyArray) {
        if (family in frequencyMap) {
          frequencyMap[family] = frequencyMap[family] + 1;
        } else {
          frequencyMap[family] = 1;
        }

        if (frequencyMap[family] > maxCount) {
          mostFrequentElement = family;
          maxCount = frequencyMap[family];
        }
      }

      setUniqueFamilies(Object.keys(frequencyMap).length);

      if (mostFrequentElement) {
        setCommonFamily(mostFrequentElement
          .replace(",_", ", ")
          .replace(/^./, c => c.toUpperCase()));
      } else {
        setCommonFamily("N/A")
      }
    }
  }

  useEffect(() => {
    const requestAPI = async () => {
      const response = await fetch(url, options);
      const json = await response.json();
      //const json = jsonData; (to conserve api requests was previously using a json file to test)
      if (json) {
        const filteredJson = json.filter((fish) => {
          return fish.img_src_set !== undefined && 
          fish.img_src_set !== "Not available" &&
          fish.meta?.scientific_classification?.family !== undefined &&
          fish.meta?.conservation_status !== undefined
        })
        setData(filteredJson);
        console.log(filteredJson);
      } else {
        console.log("Nothing returned.");
      }
    }
    requestAPI().catch(console.error);
  }, [])

  useEffect(() => {
    searchItems("");
  }, [data])

  useEffect(() => {
    filterItems();
  }, [searchFilteredResults, statusFilter])

  useEffect(() => {
    updateStats();
  }, [filteredResults])

  const size = 24

  return (
    <>
      <div className="main-content">
        <div className="background-image"></div>
        <div className="random-image-bkg-list"></div>
        <div className="random-image-bkg-list2"></div>
        <div className="background-image2"></div>
        <div className="container">
          <div className="header">
            <div>Fish Finder</div>
            <div>Dashboard</div>
          </div>
          <div className="statistics">
            <div className="random-image">
              <div className="random-image-bkg"></div>
            </div>
            <div className="card">
              <h1>{filteredResults?.length}</h1>
              <p>Total fish</p>
            </div>
            <div className="card">
              <h1>{uniqueFamilies}</h1>
              <p>Total unique fish families</p>
            </div>
            <div className="card">
              <h1>{commonFamily}</h1>
              <p>Most common fish family</p>
            </div>
          </div>
          <div className="inputs">
            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder="Search..."
                onChange = {(inputString) => searchItems(inputString.target.value)}
              />
              <div className="icon">
                <IoSearch />
              </div>
            </div>
            <div className="input-wrapper">
              <select 
                id="status" 
                name="status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Conservation Statuses</option>
                <option value="least_concern">Least Concern/Secure</option>
                <option value="cites_listed">CITES Listed</option>
                <option value="near_threatened">Near Threatened</option>
                <option value="vulnerable">Vulnerable</option>
                <option value="endangered">Endangered</option>
                <option value="critically_endangered">Critically Endangered</option>
                <option value="extinct">Extinct</option>
                <option value="data_deficient">Data Deficient</option>
              </select>
              <div className="icon">
                <IoCaretDown />
              </div>
            </div>
            <div className="cool-tab">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
              >
                <path
                  d={`
                    M0 0 H${size} V${size} H0 Z
                    M0 0 Q0 ${size} ${size} ${size} L${size} 0 Z
                  `}
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="list">
            {filteredResults && filteredResults.length > 0 ? (
              Object.values(filteredResults)
                .map((key) => (
                  <FishCard 
                    key={key.id}
                    name={key.name}
                    image={key.img_src_set["1.5x"]}
                    status={key.meta.conservation_status}
                    family={
                      key.meta.scientific_classification.family
                        .replace(",_", ", ")
                        .replace(/^./, c => c.toUpperCase())
                    }
                  />
                ))
            ) : (
              <div>No fish found!</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
