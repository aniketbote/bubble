import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import './blogCard.style.css';

const BlogCard = () =>{
    
    return (
    <Paper className='card' elevation={1}>
        <div className='col-1'>
            <p className='text'>{5} votes</p>
            <p className='text'>{2} comments</p>
            <p className='text'>{15} min read</p>
        </div>
        <div className='vl'></div>
        <div className='col-2'>
            <div className='single-line'>
                <Link className='header-link' to={''}><h4>React Native at Airbnb </h4> </Link>  
            </div>
            <p className='blog-text'>Although many teams relied on React Native and had planned on using it for the foreseeable future, we were ultimately unable to meet our original goals. In addition, there were a number of technical and organizational challenges that we were unable to overcome that would have made continuing to invest in React Native a challenge. When React Native worked as intended, engineers were able to move at an unparalleled speed.  </p>
        </div>
        <div className='col-3'>
            <p> <span style={{color:'blue'}}> {'John Snow'} </span> posted 15 minutes ago</p>
        </div>
    </Paper>
);}

export default BlogCard;