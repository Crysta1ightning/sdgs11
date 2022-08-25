import './path.css';
import Load from '../global/load';
import { useEffect, useState, useCallback } from 'react'
import { useParams } from "react-router-dom";
import BackKey from '../global/backkey';

function PathPage() {
	const {pathID} = useParams();
	const [loading, setLoading] = useState(true);
	const [userX, setUserX] = useState(0);
    const [userY, setUserY] = useState(0);
	const [predictTime, setPredictTime] = useState(0);
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
	const [pathName, setPathName] = useState('');
	const [pathFinished, setPathFinished] = useState(false);
	const [valid, setValid] = useState(true);

	const setFinished = useCallback(async () => {
		console.log("Set Finished");
		if(!localStorage.getItem('token')){
			console.log("User Not Logged In, No Need to Set Finished");
			return;
		}
		// fetch API for finished Spots
		const response = await fetch('https://sdgs12.herokuapp.com/api/finished', {
			method: 'GET',
			headers: {
				'x-access-token': localStorage.getItem('token')
			}
		});
		const data = await response.json();
		if(data.status === 'fail') {
			console.log("Failed to Set Finished");
            return;
		}
		const finishedData = data.finishedData; // all the spots you visited
		var finishedSpots = [];
		for(var i in finishedData) finishedSpots.push(finishedData[i].spotID);
		console.log(finishedSpots);
		setSpotList(spotList => spotList.map((spot) => {
			if(finishedSpots.includes(spot.spotID)){
				console.log("Set Finished === True for " + spot.name);
				return {...spot, finished: true};
			}
			else return {...spot, finished: false};
		}))
	}, [])

	const getPath = useCallback(async () => {
		// Part I: Get Path
		console.log(pathID);
        const response = await fetch('https://sdgs12.herokuapp.com/api/path', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pathID,
			}),
        })
		const data = await response.json();
		if(data.status === 'fail'){
			setValid(false);
			setLoading(false);
			console.log("Failed to Get Path");
			return;
		}

		const pathData = data.pathData;
		console.log("hi" + pathData);
		setPathName(pathData.name);

		const spotPath = data.spotPath;
		console.log(spotPath);

		// Part II: Get Spots
		var spotIDList = [];
		for(var i in spotPath){
            spotIDList.push(spotPath[i].spotID);
        };
		console.log(spotIDList);

		const response2 = await fetch('https://sdgs12.herokuapp.com/api/spotAll', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				spotIDList,
			}),
		})
		const data2 = await response2.json();
		if(data2.status === 'fail'){
			console.log("Failed to Get Spots");
			setLoading(false);
			return;
		}
		const spotData = data2.spotData;
		console.log("SpotData: " + spotData);
		setSpotList(spotData);
		setUserX(70);
		setUserY(70);
		await setFinished();
		setLoading(false);
    }, [pathID, setFinished]);

    useEffect(() => {
        getPath();
    }, [getPath]);

    useEffect(() => {
        console.log("Set New Distance");
        var newDistance;
        setSpotList(spotList => spotList.map((spot) => {
            newDistance = Math.round(Math.sqrt(Math.pow(userX-spot.x, 2) + Math.pow(userY-spot.y, 2)));
            return {...spot, distance: newDistance}; 
        }))
    }, [userX, userY]);

	useEffect(() => {
		if(spotList.length === 0) return;
		console.log("Set Predict Time & PathFinished");
		var newPredictTime = 0;
		for(var i in spotList){
			if(!spotList[i].finished) newPredictTime += spotList[i].distance;
		}
		setPredictTime(newPredictTime);
		if(newPredictTime === 0) {
			setPathFinished(true);
		}
	}, [spotList])

	if(loading) return <Load/>;
	return (
		<div className="Path">
			{valid? (
				<>
					<div>
						<BackKey from={200}/> 
						<h1>{pathName}{pathFinished? "✅": ""}</h1>
						<h2>所有建築預覽</h2>
					</div>
					<div className="pathSpots">
						{spotList.map((spot) => {
							return ( 
								<button className="card" key={spot.spotID} onClick={() => {window.location.href = '/spot/' + spot.spotID + '/' + pathID}}>
									<h3>{spot.name}{spot.finished? "✅": ""}</h3>
									<p>距離: {spot.distance}m</p>
								</button>
							)
						})}
					</div>
					<h2 className="predictedTime">預計完成時間: {predictTime}分鐘</h2>
					<button onClick={() => {window.location.href = '/path/' + pathID + '/map'}}>Map</button>
				</>
            ) : (
                <div>
                    <h3>Invalid or Expired URL</h3>
                    <p>If you have any problem with this, please contact us via <a href = "mailto: nthutestsdgs@gmail.com">nthutestsdgs@gmail</a></p>
                </div>
            )}
		</div>
	)
}

export default PathPage