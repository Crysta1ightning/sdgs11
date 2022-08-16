import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import './pathmain.css';
import { useNavigate } from "react-router-dom";

function PathMain() {
    const navigate = useNavigate();
    const [pathList, setPathList] = useState([
        // {pathID: 1, name: "共同生活圈", finished: false},
        // {pathID: 2, name: "生科, 人社路徑", finished: false},
        // {pathID: 3, name: "科管院路徑", finished: false},
    ]);

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
            setFinishPath();
        });
    }, [GetPaths, setFinishPath]);

    function ChoosePath (path){
        console.log("Choose Path");
        localStorage.setItem('pathID', path.pathID);
        navigate('/path/pathpage');
        // window.location.href = 'path/pathpage';
    }

	return (
		<div className="PathMain">
            <h1>各院導覽</h1>
            {pathList.map((path) => {
                return(
                    <div className="card" style={{animationDelay: `${(path.pathID-1)*150}ms`}} key={path.pathID} onClick={() => {ChoosePath(path)}}>
                        <h2>{path.name}{path.finished ? "✅": ""}</h2>
                    </div>
                )
			})}
		</div>
	)

}

export default PathMain