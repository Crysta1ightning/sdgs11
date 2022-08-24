import React from 'react';
import './preface.css';
// import {Link} from 'react-scroll';

function PrefacePage () {
	
	
	return (
		<div className="PrefacePage">
			<div className="preface">
				<div id="0" className='pages'>
					<div className='big-box'>
						<img src={require('../../images/preface/1.png')} alt="1"/>
						<div className="box"/>
						<h1>宮保雞丁</h1>
						<hr/>
						<p>	首先將雞肉切塊後與醃料均勻混合醃製15~20分鐘。
							起油鍋，將雞肉下鍋炒至約7分熟後起鍋備用。
							利用同一油鍋，將蔥白、薑、蒜下鍋爆香。
							接著將乾辣椒與雞肉下鍋炒熟。
							最後起鍋前再加入蔥綠、麻辣花生和適量的鹽與糖調味即可。</p>
					</div>
					<button>下一頁</button>
				</div>
				<div id="1" className='pages'>
					<div className='big-box'>
						<img src={require('../../images/preface/2.png')} alt="2"/>
						<div className="box"/>
						<h1>前言二</h1>
						<hr/>
						<p></p>	
					</div>
					<button>下一頁</button>
				</div>
				<div id="2" className='pages'>
					<div className='big-box'>
						<img src={require('../../images/preface/3.png')} alt="3"/>
						<div className="box"/>
						<h1>前言三</h1>
						<hr/>
					</div>
					<button>下一頁</button>
				</div>
				<div id="3" className='pages'>
					<div className='big-box'>
						<img src={require('../../images/preface/4.png')} alt="4"/>
						<div className="box"/>
						<h1>前言四</h1>
						<hr/>
					</div>
					<button onClick={() => {window.location.href = '/all'}}>立即開始</button>
				</div>
			</div>
		</div>
	);
  };

export default PrefacePage;