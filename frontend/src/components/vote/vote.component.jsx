import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from '@mui/material';

import './vote.style.css'
const VoteComponent = ({vote_count})=>{
    return <div style={{display:'flex',flexDirection:'column',minWidth:'60px',marginLeft:'-12px'}}>
        <IconButton>
            <KeyboardArrowUpIcon className="icon-display" fontSize='large'/>
        </IconButton>
        <div className='vote-count' > <p>{vote_count}</p> </div>
        <IconButton style={{marginTop:'-8px'}}>
            <KeyboardArrowDownIcon className="icon-display"  fontSize='large'/>
        </IconButton>
        </div>
}

export default VoteComponent;