import './path.css';
import Load from '../global/load';
import { useEffect, useState, useCallback } from 'react'
import { useJsApiLoader } from '@react-google-maps/api';
import { useParams } from "react-router-dom";
import BackKey from '../global/backkey';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular} from '@fortawesome/fontawesome-svg-core/import.macro';

function PathPage() {
	const {pathID} = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(true);
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: "AIzaSyAWGySAUlZ2lcu2S9zt5B852RD6ghn3th8",
	})
	const [userLat, setUserLat] = useState(0);
    const [userLng, setUserLng] = useState(0);
	const [predictTime, setPredictTime] = useState(0);
	const [spotList, setSpotList] = useState([
		// {spotID: 1, x: 50, y: 150, name: "人社院", description: "人社院是迷宮"},
		// {spotID: 2, x: 70, y: 60, name: "台達館", description: "資工電神所在地"},
		// {spotID: 3, x: 80, y: 90, name: "小吃部", description: "小吃部只有麥當勞"}, 
		// {spotID: 4, x: 10, y: 10, name: "成功湖", description: "很大的一個湖"},
		// {spotID: 5, x: 20, y: 130, name: "教育館", description: "上通識課的地方"},  
        // {spotID: 6, x: 100, y: 100, name: "旺宏館", description: "這是旺宏館"}, 
        // {spotID: 7, x: 60, y: 100, name: "生科院", description: "叉叉!"}, 
        // {spotID: 8, x: 120, y: 120, name: "葉子", description: "就是個葉子"},
    ]);
	const [distanceList, setDistanceList] = useState([])
	const [pathName, setPathName] = useState('');
	const [pathFinished, setPathFinished] = useState(false);
	const imgList = [
        {src: require('../../images/spot/人社院.jpg')},
        {src: require('../../images/spot/台達館.jpg')},
        {src: require('../../images/spot/小吃部.jpg')},
        {src: require('../../images/spot/成功湖.jpg')},
        {src: require('../../images/spot/教育館.jpg')},
        {src: require('../../images/spot/旺宏館.jpg')},
        {src: require('../../images/spot/生科二館.jpg')},
        {src: require('../../images/spot/葉子.jpg')},
        {src: require('../../images/spot/台積館.jpg')},
    ];

	const getUserLatLng = useCallback(() => {
		// Dummy Fetch
		navigator.geolocation.getCurrentPosition(()=>{}, ()=>{}, {});
		const success = (position) => {
			setUserLat(position.coords.latitude);
			setUserLng(position.coords.longitude);
		}
		const fail = () => {};
		navigator.geolocation.getCurrentPosition(
			success, fail, {
				enableHighAccuracy: true, 
				timeout:10000
			}
		);
	}, [])

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

	const onLoad = useCallback( async () => {
		// Part I: Get Path
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
		setPathName(pathData.name);

		const spotPath = data.spotPath;

		// Part II: Get Spots
		var spotIDList = [];
		for(var i in spotPath){
			spotIDList.push(spotPath[i].spotID);
		};

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
			setValid(false);
			setLoading(false);
			return;
		}
		const spotData = data2.spotData;
		setSpotList(spotData);
		await setFinished();

		// Part III: SET PATH
		const google = window.google;
		const directionsService = new google.maps.DirectionsService();
		var waypoints = [];
		for (i=0; i<spotData.length; i++) {
			if(i === 0 || i === spotData.length-1){
				continue;
			}
			waypoints.push({
				location: {lat: spotData[i].lat, lng: spotData[i].lng},
				// location: spotData[i].name,
				// stopover: false
			})
		}
		var request = {
			origin: {lat: spotData[0].lat, lng:spotData[0].lng},
			destination: {lat: spotData[spotData.length-1].lat, lng:spotData[spotData.length-1].lng},
			waypoints: waypoints,
			travelMode: 'WALKING',
			optimizeWaypoints: true
		};

		directionsService.route(request, function (result, status) {
			var tempDuration = 0;
			if (status === 'OK') {
				for(var i in result.routes[0].legs) {
					for(var j in result.routes[0].legs[i].steps) {
						tempDuration += result.routes[0].legs[i].steps[j].duration.value;
					}
				}
				// directionsDisplay.setDirections(result);
				setPredictTime(tempDuration);
			} else {
				console.log(status);
			}
		});

		let interval;
		getUserLatLng();
		interval = setInterval(getUserLatLng, 1000);
		return () => clearInterval(interval);
	}, [setFinished, getUserLatLng, pathID])
	
	useEffect(() => {
		onLoad();
	}, [onLoad])
	
    useEffect(() => {
		let destinations = [];
		for (var i in spotList) {
			destinations.push({lat: spotList[i].lat, lng: spotList[i].lng});
		}
		if(navigator.geolocation){
			if(userLat === 0) return;
			function error() {
				alert('無法取得你的位置');
			}
			async function success(position) {
				const service = new window.google.maps.DistanceMatrixService();
				await service.getDistanceMatrix({
					origins: [{lat: userLat, lng: userLng}],
					destinations: destinations,
					travelMode: 'WALKING', // 交通方式：BICYCLING(自行車)、DRIVING(開車，預設)、TRANSIT(大眾運輸)、WALKING(走路)
					unitSystem: window.google.maps.UnitSystem.METRIC, // 單位 METRIC(公里，預設)、IMPERIAL(哩)
					avoidHighways: true, // 是否避開高速公路
					avoidTolls: true // 是否避開收費路線
				}, callback);  
				function callback(response, status){
					var tempList = [];
					for(i in response.rows[0].elements) {
						tempList.push(response.rows[0].elements[i].distance.value);
					}
					setDistanceList(tempList);
				}
				setLoading(false);
			}
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			alert('sorry')
		}
    }, [userLat, userLng, spotList]);

	useEffect(() => {
		if(spotList.length === 0) return;
		console.log("Set Predict Time & PathFinished");
		var finished = true;
		for(var i in spotList){
			if(!spotList[i].finished) {
				finished = false
				break;
			}
		}
		if(finished) setPathFinished(true);
	}, [spotList])

	if(loading || !isLoaded) return <Load/>;
	return (
		<div className="Path">
			{valid? (
				<>	
					<div className='header'>
						<BackKey from={200}/>
						<h1>{pathName}</h1>
						{pathFinished? 
						<div className='check'><FontAwesomeIcon icon={regular('check-square')} /></div>
						: 
						// <div className='check'><FontAwesomeIcon icon={regular('square')} /></div>
						""}
			
					</div>
					<div className='line-text'>
						<p>路徑建築預覽</p>
					</div>
					
					<div className="pathSpots">
						{spotList.map((spot, id) => {
							return ( 
								<div className="card" key={spot.spotID} onClick={() => {window.location.href = '/spot/' + spot.spotID + '/' + pathID}}>
									<div className='container'>
										<img src={imgList[spot.spotID-1].src} alt="圖片"></img>
									</div>
									<h1>{spot.name}{spot.finished? 
										<div className='check'><FontAwesomeIcon icon={regular('check-square')} /></div>
										: 
										// <div className='check'><FontAwesomeIcon icon={regular('square')} /></div>
										""}
									</h1>
									<p>距離: {
										!distanceList[id]? 
										'?'
										: 
										<>{distanceList[id] >= 1000 ?
											<>{Math.round(distanceList[id]/100)/10}公里</> 
											:
											<>{distanceList[id]}公尺</>}
										</>}
									</p>
								</div>
							)
						})}
					</div>
					<div className='line-text'><p>預計完成時間: {predictTime>=60? 
						<>{Math.round(predictTime/60)}分鐘</>
						: 
						<>{predictTime===0? 
							<>0分鐘</>
							:
							<>{"<"}1分鐘</>
						}</>
						}</p>
					</div>
					<div className='start-btn' onClick={() => {window.location.href = '/path/' + pathID + '/map'}}>開始導覽</div>
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