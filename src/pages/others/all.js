import React, { useCallback } from 'react';
import './all.css';
import Navbar from '../global/navbar';
import Load from '../global/load';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

function AllPage () {
    const [loading, setLoading] = useState(true);
	const [spotList, setSpotList] = useState([
		// {spotID: 1, x: 50, y: 150, name: "人社院", description: "人社院是迷宮", distance: 0},
		// {spotID: 2, x: 70, y: 60, name: "台達館", description: "資工電神所在地", distance: 0},
		// {spotID: 3, x: 80, y: 90, name: "小吃部", description: "小吃部只有麥當勞", distance: 0}, 
		// {spotID: 4, x: 10, y: 10, name: "成功湖", description: "很大的一個湖", distance: 0},
		// {spotID: 5, x: 20, y: 130, name: "教育館", description: "上通識課的地方", distance: 0},  
        // {spotID: 6, x: 100, y: 100, name: "旺宏館", description: "這是旺宏館", distance: 0}, 
        // {spotID: 7, x: 60, y: 100, name: "生科院", description: "叉叉!", distance: 0}, 
        // {spotID: 8, x: 120, y: 120, name: "葉子", description: "就是個葉子", distance: 0},
    ]);
    const [searchList, setSearchList] = useState([]);
    const [searchText, setSearchText] = useState('');
    function search(event){
        event.preventDefault();
        var newlist = [];
        for(var i in spotList){
            if(spotList[i].name.includes(searchText)){
                newlist.push(spotList[i]);
            }
        }
        setSearchList(newlist);
    }

    const getSpots = useCallback(async () => {
        console.log("Fetch SpotData");
        const response = await fetch('https://sdgs12.herokuapp.com/api/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if(data.status === 'fail'){
            console.log("Failed to get spots");
            return;
        };
        const spotData = data.spotData;
        
        var newList = []
        for(var i in spotData){
            newList.push({
                spotID: spotData[i].spotID, 
                name: spotData[i].name, 
                description: spotData[i].description,
                x: spotData[i].x,
                y: spotData[i].y,
            });
        }
        setSpotList(newList);
        setSearchList(newList);
        setLoading(false);
    }, []);

    useEffect(() => {
        getSpots();
    }, [getSpots]);

    const [active, setActive] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', pop);
      
        return () => window.removeEventListener('scroll', pop);
    },[]);

    const pop = () => {
        if (window.pageYOffset > 0) {
            setActive(true);
        }
                 
        if (window.pageYOffset === 0) {
            setActive(false);
        }
            
        // setNavColor(null);
    }

    if(loading) return <Load/>;
    return (
        <div className="AllPage">
             <div className={active? 'top top-shadow': 'top'}>
                <Navbar/>
                <h1>地點總覽</h1>
                <button className='map-btn' onClick={() => {window.location.href = '/path/:pathID/map'}}>
                    <FontAwesomeIcon icon={solid("map-location-dot")}></FontAwesomeIcon>
                </button>
                <form onSubmit={search}>
                <input
                    className="search-text"
                    type="text"
                    placeholder="搜尋關鍵字 如: 小吃部"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}>
                </input>
                <div className="search-button" type="submit" value="">
                    <FontAwesomeIcon icon={solid('magnifying-glass')}/>
                </div>
            </form>
            </div>
            
            <div className='card-container'>
                {searchList.map((spot) => {
                    return ( 
                        <button className="card" key={spot.spotID} onClick={() => {window.location.href = '/spot/' + spot.spotID + '/0'}}>
                            <h3>{spot.name}</h3>
                        </button>
                    )
                })}
            </div>
            {/* <div>
                <h3>User X: {userX}, User Y: {userY}</h3>
                <button onClick={() => {setUserX(userX+1)}}>User X+</button>
                <button onClick={() => {setUserX(userX-1)}}>User X-</button>
                <button onClick={() => {setUserY(userY+1)}}>User Y+</button>
                <button onClick={() => {setUserY(userY-1)}}>User Y-</button>
            </div> */}
        </div>
    )
}

export default AllPage