import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import './backkey.css';

function BackKey(props){
    var back;
    if(props.from) {
        if(props.from === '0') {
            // spot -> all
            back = () => {window.location.href = '/all';};
        }else if(props.from === 200) {
            // spot -> pathmain
            back = () => {window.location.href = '/path';};
        }else if(props.from === 400) {
            // resetmail -> login
            back = () => {window.location.replace('/login');};
        }else{
            // spot -> path
            back = () => {window.location.href = '/path/' + props.from;};
        }
    }else {
        back = () => {window.history.back();};
    }
    return (
        <div className="BackKey">
            <div className="menu-btn" onClick={back}><FontAwesomeIcon icon={solid('arrow-left')} /></div>
        </div>
    );   
}

export default BackKey;