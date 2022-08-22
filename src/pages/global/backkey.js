import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import './backkey.css';

function BackKey(){
    return (
        <div className="BackKey">
            <div className="menu-btn" onClick={() => {window.history.back()}}><FontAwesomeIcon icon={solid('arrow-left')} /></div>
        </div>
    );   
}

export default BackKey;