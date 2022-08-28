import Load from '../global/load';
import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import './pathmain.css';
import Navbar from '../global/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'


function PathMainPage() {
    const [loading, setLoading] = useState(true);
    const [pathList, setPathList] = useState([
        // {pathID: 1, name: "共同生活圈", finished: false},
        // {pathID: 2, name: "生科, 人社路徑", finished: false},
        // {pathID: 3, name: "科管院路徑", finished: false},
    ]);
    const imgList = [
        {src: require('../../images/path/大門.png')},
        {src: require('../../images/path/永續路徑.png')},
        {src: require('../../images/path/台達館.png')},
        {src: require('../../images/path/工一.png')},
        {src: require('../../images/path/台積館.png')},
    ];
 
    const GetPaths = useCallback(async () => {
        const response = await fetch('https://sdgs12.herokuapp.com/api/pathList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json();
        if(data.status === 'fail'){
            console.log(data.error);
            return;
        }
        const pathListData = data.pathListData;
        
        var newlist = []
        for(var i in pathListData){
            newlist.push({
                pathID: pathListData[i].pathID, 
                name: pathListData[i].name, 
                finished: false,
            });
        }
        console.log("SET PATH LIST");
        setPathList(newlist);
    }, []);

    const setFinishPath = useCallback(async () => {
		if(!localStorage.getItem('token')){
			console.log("User Not Logged In, No Need to Set Finish Path");
			return;
		}
		const response = await fetch('https://sdgs12.herokuapp.com/api/pathFinish', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token')
			},
		})
		const data = await response.json();
		if(data.status === 'fail'){
			console.log(data.error);
			return;
		}
        const spotPath = data.spotPath; 
		const userSpot = data.userSpot;

        // Make spsotPathList
        var spotPathList = new Map();
        var i, newlist;
        for(i in spotPath){
            if(spotPathList.has(spotPath[i].pathID)){
                newlist = spotPathList.get(spotPath[i].pathID);
            }else{
                newlist = [];
            }
            newlist.push(spotPath[i].spotID);
            spotPathList.set(spotPath[i].pathID, newlist);
        }
        console.log(spotPathList);

        // make userhas 
        var userhas = [];
        for(i in userSpot){
            userhas.push(userSpot[i].spotID);
        }
        console.log(userhas);

        // compare
        setPathList(pathList => pathList.map((path) => {
            if(spotPathList.has(path.pathID) && spotPathList.get(path.pathID).every(val => userhas.includes(val))){
                console.log("Set Finished === True for" + path.name);
                return{...path, finished: true};
            }
            return{...path, finished: false}; 
        }))
	}, []);

    useEffect(() => {
        GetPaths().then(() => {
            setFinishPath().then(() => {
                setLoading(false);
            });
        });
    }, [GetPaths, setFinishPath]);

    function ChoosePath (path){
        console.log("Choose Path");
        window.location.href = '/path/' + path.pathID;
    }
    
    if(loading) return <Load/>;
	return (
		<div className="PathMain">
            <div className='top'>
                <Navbar/>
                <h1>路徑導覽</h1>
                <button className='map-btn' onClick={() => {window.location.href = '/path/:pathID/map'}}>
                    <FontAwesomeIcon icon={solid("map-location-dot")}></FontAwesomeIcon>
                </button>
            </div>
            <div className='container'>
                {pathList.map((path) => {
                    return(
                        <div className="card" style={{animationDelay: `${(path.pathID-1)*150}ms`}} key={path.pathID} onClick={() => {ChoosePath(path)}}>
                            <h2>{path.name}{path.finished ? "✅": ""}</h2>
                            <img src={imgList[path.pathID-1].src} alt="圖片"></img>
                        </div>
                    )
                })}
            </div>
		</div>
	)

}

export default PathMainPage