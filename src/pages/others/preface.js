import React, {useState, useEffect} from 'react';
import './preface.css';
import Navbar from '../global/navbar';

function PrefacePage () {
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
			<div className='title'>
				<img src={require("../../images/永續清華logo.png")} alt="nthu sdgs logo"></img>
				<div className='vertical-line'></div>
				<h1>清華永續步道</h1>
				<h2>NTHU<br/>Sustainability Trail</h2>
			</div>
			<div className='content'>
				<h1>為什麼要做校園永續步道計畫？</h1>
				<p>新竹市政府與清華大學攜手光復路綠門戶計畫，於今年１月正式開工。將開放圍牆共享校園、綠化與重劃空間，提供民眾舒適的生活環境。<br/>
				當SDGs受重視，我們更加思考如何永續的經營家園，擁有舒適的環境，這不僅是追求生活品質的提升，也是希望達到環境共好、在地共融的目標。</p>
				<h1>我們的期待</h1>
				<p>透過深度訪查與盤點，將清華歷史、人文、環境與教育的故事，一個一個串聯成開放的、人人皆可走訪的校園步道。藉由線上線下資源整合，
					提供更多元、立體的服務體驗。走入校園體驗導覽，或進入網站遠距導覽，作為實體行走前的時間與路徑規劃，從多個面向認識清華校園。<br/>
					我們期待打開清華，將清華傳承超過花甲的獨特文化與青春的生活百態，匯聚成永續步道，向里民導覽、對社區開放，促進在地共融。
					當清華永續步道成為社區、家長、外賓、國中小師生的必經之路，「Open House NTHU」的永續精神將持續傳遞與傳承。
				</p>
			</div>
			<div className='btns'>
				<div className='start-btn' onClick={() => {window.location.href = '/all'}}>立即開始</div>
				<div className='login-btn' onClick={() => {window.location.href = '/login'}}>登入</div>
			</div>
		</div>
	);		
};

export default PrefacePage;

// import { useRef } from 'react'; 

// const page2 = useRef(null);
// const page3 = useRef(null);
// const page4 = useRef(null);

// const handleClick = (elementRef) => {
// 	elementRef.current?.scrollIntoView({behavior:"smooth"})
// };


/*{ <div className="preface">
<div className='pages'>
	<div className='big-box'>
		<img src={require('../../images/preface/1.png')} alt="1"/>
		<div className="box"/>
		<h1>宮保雞丁</h1>
		<hr/>
		<p>	首先將雞肉切塊後與醃料均勻混合醃製15~20分鐘。
			起油鍋，將雞肉下鍋炒至約7分熟後起鍋備用。
			利用同一油鍋，將蔥白、薑、蒜下鍋爆香。
			接著將乾辣椒與雞肉下鍋炒熟。
			最後起鍋前再加入蔥綠、麻辣花生和適量的鹽與糖調味即可。
		</p>
	</div>
	<button onClick={() => handleClick(page2)}>下一頁</button>
</div>
<div ref={page2} className='pages'>
	<div className='big-box'>
		<img src={require('../../images/preface/2.png')} alt="2"/>
		<div className="box"/>
		<h1>前言二</h1>
		<hr/>
		<p>
		首先將雞肉切塊後與醃料均勻混合醃製15~20分鐘。
			起油鍋，將雞肉下鍋炒至約7分熟後起鍋備用。
			利用同一油鍋，將蔥白、薑、蒜下鍋爆香。
			接著將乾辣椒與雞肉下鍋炒熟。
			最後起鍋前再加入蔥綠、麻辣花生和適量的鹽與糖調味即可。</p>	
	</div>
	<button onClick={() => handleClick(page3)}>下一頁</button>
</div>
<div ref={page3} className='pages'>
	<div className='big-box'>
		<img src={require('../../images/preface/3.png')} alt="3"/>
		<div className="box"/>
		<h1>前言三</h1>
		<hr/>
		<p>
		首先將雞肉切塊後與醃料均勻混合醃製15~20分鐘。
			起油鍋，將雞肉下鍋炒至約7分熟後起鍋備用。
			利用同一油鍋，將蔥白、薑、蒜下鍋爆香。
			接著將乾辣椒與雞肉下鍋炒熟。
			最後起鍋前再加入蔥綠、麻辣花生和適量的鹽與糖調味即可。
		</p>
	</div>
	<button onClick={() => handleClick(page4)}>下一頁</button>
</div>
<div ref={page4} className='pages'>
	<div className='big-box'>
		<img src={require('../../images/preface/4.png')} alt="4"/>
		<div className="box"/>
		<h1>前言四</h1>
		<hr/>
		<p>
		首先將雞肉切塊後與醃料均勻混合醃製15~20分鐘。
			起油鍋，將雞肉下鍋炒至約7分熟後起鍋備用。
			利用同一油鍋，將蔥白、薑、蒜下鍋爆香。
			接著將乾辣椒與雞肉下鍋炒熟。
			最後起鍋前再加入蔥綠、麻辣花生和適量的鹽與糖調味即可。
		</p>
	</div>
	<div className='inline'>
		<button className="inline-btn" onClick={() => {window.location.href = '/all'}}>立即開始</button>
		<button className="inline-btn" onClick={() => {window.location.href = '/login'}}>登入</button>
	</div>
</div>
</div> }*/