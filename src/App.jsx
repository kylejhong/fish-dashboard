import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import jsonData from './data.json'
import FishCard from './components/FishCard';
import { IoSearch, IoCaretDown } from "react-icons/io5";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

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

const COLORS = [
  '#b9c6f4ff',
  '#add0f1ff',
  '#a1d1efff',
  '#b7e6f6ff',
  '#b7f1f5ff',
  '#b9e8caff',
  '#d7eccbff',
  '#e6f3d8ff'
];

function App() {
  const [data, setData] = useState(null)
  const [searchFilteredResults, setSearchFilteredResults] = useState(null)
  const [filteredResults, setFilteredResults] = useState(null)
  const [conservationData, setConservationData] = useState(null)
  const [familyData, setFamilyData] = useState(null)
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

      const entries = Object.entries(frequencyMap);

      const familyChartData = (entries.length > 20
        ? entries.filter(([_, count]) => count > 2)
        : entries
      ).map(([family, count]) => ({ family, count }));

      setFamilyData(familyChartData);

      const conservationMap = {};
      for (const fish of filteredResults) {
        let status = fish.meta?.conservation_status.split(' ')[0] + " " + fish.meta?.conservation_status.split(' ')[1];
        if (status.endsWith("(IUCN")) {
          status = status.slice(0, -5);
        }

        if (status in conservationMap) {
          conservationMap[status] = conservationMap[status] + 1;
        } else {
          conservationMap[status] = 1;
        }
      }

      const conservationChartData = Object.entries(conservationMap).map(([name, value]) => ({
        name,
        value
      }));

      setConservationData(conservationChartData);
    }
  }

  useEffect(() => {
    const requestAPI = async () => {
      const response = await fetch(url, options);
      const json = await response.json();
      //const json = jsonData; //(to conserve api requests was previously using a json file to test)
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
      <div className="chart-wrapper">
        <div className="chart">
          <h3>Conservation Status Distribution</h3>
          {conservationData ? (
            <ResponsiveContainer>
              <PieChart margin={{ bottom: 80 }}>
                <Pie
                  data={conservationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#8884d8"
                  label
                >
                  {conservationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
        <div className="chart">
          <h3>Most Common Fish Families</h3>
          {familyData ? (
            <ResponsiveContainer>
              <BarChart data={familyData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="family"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fill: 'white', fontSize: 10 }}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                />
                <YAxis
                  tick={{ fill: 'white' }}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    return [`Count: ${value}`, `Family: ${props.payload.family}`];
                  }}
                />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading chart data...</p>
          )}
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
    
    </>
  )
}

export default App
