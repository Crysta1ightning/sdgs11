import React, { useCallback, useEffect, useState } from 'react';
import './all.css';
import Navbar from '../global/navbar';
import Load from '../global/load';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

function AllPage () {
    const [loading, setLoading] = useState(true);
	const [spotList, setSpotList] = useState([
		// {spotID: 1, lat: 50, lng: 150, name: "人社院", description: "人社院是迷宮", distance: 0},
		// {spotID: 2, lat: 70, lng: 60, name: "台達館", description: "資工電神所在地", distance: 0},
		// {spotID: 3, lat: 80, lng: 90, name: "小吃部", description: "小吃部只有麥當勞", distance: 0}, 
		// {spotID: 4, lat: 10, lng: 10, name: "成功湖", description: "很大的一個湖", distance: 0},
		// {spotID: 5, lat: 20, lng: 130, name: "教育館", description: "上通識課的地方", distance: 0},  
        // {spotID: 6, lat: 100, lng: 100, name: "旺宏館", description: "這是旺宏館", distance: 0}, 
        // {spotID: 7, lat: 60, lng: 100, name: "生科院", description: "叉叉!", distance: 0}, 
        // {spotID: 8, lat: 120, lng: 120, name: "葉子", description: "就是個葉子", distance: 0},
    ]);

    const [imgList, setImgList] = useState([
        // {src: require('../../images/spot/人社院.jpg')},
        // {src: require('../../images/spot/台達館.jpg')},
        // {src: require('../../images/spot/小吃部.jpg')},
        // {src: require('../../images/spot/成功湖.jpg')},
        // {src: require('../../images/spot/教育館.jpg')},
        // {src: require('../../images/spot/旺宏館.jpg')},
        // {src: require('../../images/spot/生科二館.jpg')},
        // {src: require('../../images/spot/葉子.jpg')},
        // {src: require('../../images/spot/台積館.jpg')},
    ]);

    const [searchList, setSearchList] = useState([]);
    const [searchText, setSearchText] = useState('');
    function search(searchText){
        var newlist = [];
        for(var i in spotList){
            if(spotList[i].name.includes(searchText)){
                newlist.push(spotList[i]);
            }
        }
        setSearchList(newlist);
    }

    const getSpots = useCallback(async () => {
        // SPOT DATA
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

        // FINISHED DATA
        var finishedSpots = [];
        var i;
        if(!localStorage.getItem('token')){
			console.log("User Not Logged In, No Need to Set Finished");
		} else {
            // fetch API for finished Spots
            const response2 = await fetch('https://sdgs12.herokuapp.com/api/finished', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            });
            const data2 = await response2.json();
            if(data2.status === 'fail') {
                console.log("Failed to Set Finished");
            } else {
                const finishedData = data2.finishedData; // all the spots you visited
                for(i in finishedData) finishedSpots.push(finishedData[i].spotID);
            }
        }

        var newList = [];
        var newImgList = [];
        for(i in spotData){
            if(finishedSpots.includes(spotData[i].spotID)) {
                newList.push({
                    spotID: spotData[i].spotID, 
                    name: spotData[i].name, 
                    description: spotData[i].description,
                    finished: true,
                })
            } else {
                newList.push({
                    spotID: spotData[i].spotID, 
                    name: spotData[i].name, 
                    description: spotData[i].description,
                    finished: false,
                })
            }
            try{
                newImgList.push({src: require('../../images/spot/'+spotData[i].name+'.jpg')})
            } catch (err) {
                newImgList.push({src: require('../../images/spot/image-not-found.jpg')})
            }
        }
        setImgList(newImgList);
        setSpotList(newList);
        setSearchList(newList);

        // SET FINSHED
		
		console.log(finishedSpots);
		setSpotList(spotList => spotList.map((spot) => {
			if(finishedSpots.includes(spot.spotID)){
				return {...spot, finished: true};
			}
			else return {...spot, finished: false};
		}))
        setSearchList(searchList => searchList.map((spot) => {
			if(finishedSpots.includes(spot.spotID)){
				return {...spot, finished: true};
			}
			else return {...spot, finished: false};
		}));
        setLoading(false);
    }, []);

    useEffect(() => {
        getSpots();
    }, [getSpots]);

    //disappearable shadow
    const [active, setActive] = useState(false);

    useEffect(() => {
        if(typeof(window) === 'undefined') return;
        window.addEventListener('scroll', pop);
      
        return () => window.removeEventListener('scroll', pop);
    },[]);

    const pop = () => {
        if(typeof(window) === 'undefined') return;
        if (window.pageYOffset > 0) {
            setActive(true);
        }        
        if (window.pageYOffset === 0) {
            setActive(false);
        }
        // setNavColor(null);
    }

    //disappearable searchbar
    const [scrollDirection, setScrollDirection] = useState(null);

    useEffect(() => {
        if(typeof window === 'undefined') return;
        let lastScrollY = window.pageYOffset;
        const updateScrollDirection = () => {
            const scrollY = window.pageYOffset;
            const direction = scrollY > lastScrollY ? "down" : "up";
            if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener("scroll", updateScrollDirection); // add event listener
        return () => {
            window.removeEventListener("scroll", updateScrollDirection); // clean up
        }
    }, [scrollDirection]);

    if(loading) return <Load/>;
    return (
        <div className="AllPage">
            <div className={active? 'header header-shadow': 'header'}>
                <h1>地點總覽</h1>
            </div>
            <Navbar/>
            <div className='map-btn' onClick={() => {window.location.href = '/path/0/map'}}>
                <FontAwesomeIcon icon={solid("map-location-dot")}></FontAwesomeIcon>
            </div>
            <div className={(scrollDirection === 'down') ? 'search hide': 'search'}>
                <input
                    className="search-text"
                    type="text"
                    placeholder="搜尋關鍵字 如: 小吃部"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        search(e.target.value);
                    }}
                >
                </input>
                <div className="search-button">
                    <FontAwesomeIcon icon={solid('magnifying-glass')}/>
                </div>
            </div>
            <div className='card-container'>
                {searchList.map((spot) => {
                    return ( 
                        <div className="card" key={spot.spotID} onClick={() => {window.location.href = '/spot/' + spot.spotID + '/0'}}>
                            <img src={imgList[spot.spotID-1].src} alt="圖片"></img>
                            <h1>{spot.name}</h1>
                            {spot.finished? 
								<div className='check'>已領取</div>
								: 
								// <div className='check'><FontAwesomeIcon icon={regular('square')} /></div>
								""
							}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllPage