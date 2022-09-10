import React, {useState, useEffect} from 'react';
import './preface.css';
import Navbar from '../global/navbar';

function AboutPage () {
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
    }

	return (
		<div className="PrefacePage">
			<div className={active? 'header header-shadow': 'header'}>
                <h1>關於計畫</h1>
            </div>
			<Navbar/>
			<div className='title title-about'>
				<img src={require("../../images/永續清華logo.png")} alt="nthu sdgs logo"></img>
				<div className='vertical-line'></div>
				<h1>清華永續步道</h1>
				<h2>NTHU<br/>Sustainability Trail</h2>
			</div>
			<div className='content'>
				<h1>為什麼要做校園永續步道計畫？</h1>
				<p>
					&emsp;&emsp;新竹市政府與清華大學攜手光復路綠門戶計畫，於今年１月正式開工。將開放圍牆共享校園、綠化與重劃空間，提供民眾舒適的生活環境。
					<br/><br/>
					&emsp;&emsp;當SDGs受重視，我們更加思考如何永續的經營家園，擁有舒適的環境，這不僅是追求生活品質的提升，也是希望達到環境共好、在地共融的目標。
				</p>
				<h1>我們的期待</h1>
				<p>&emsp;&emsp;透過深度訪查與盤點，將清華歷史、人文、環境與教育的故事，一個一個串聯成開放的、人人皆可走訪的校園步道。藉由線上線下資源整合，
					提供更多元、立體的服務體驗。走入校園體驗導覽，或進入網站遠距導覽，作為實體行走前的時間與路徑規劃，從多個面向認識清華校園。
					<br/><br/>
					&emsp;&emsp;我們期待打開清華，將清華傳承超過花甲的獨特文化與青春的生活百態，匯聚成永續步道，向里民導覽、對社區開放，促進在地共融。
					當清華永續步道成為社區、家長、外賓、國中小師生的必經之路，「Open House NTHU」的永續精神將持續傳遞與傳承。
				</p>
			</div>
		</div>
	);		
};

export default AboutPage;