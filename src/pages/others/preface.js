import React from 'react';
import './preface.css';
import { useRef } from 'react'; 

function PrefacePage () {

	const page2 = useRef(null);
	const page3 = useRef(null);
	const page4 = useRef(null);

	const handleClick = (elementRef) => {
		elementRef.current?.scrollIntoView({behavior:"smooth"})
	};
	
	return (
		<div className="PrefacePage">
			<div className="preface">
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
			</div>
		</div>
	);		
};

export default PrefacePage;