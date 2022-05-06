import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import timeDifference from '../../helper/time-difference';
import './blogCard.style.css';

const BlogCard = ({blog}) =>{
    return (
    <Paper className='card' elevation={1}>
        <div className='col-1'>
            <p className='text'>{blog.vote_count} votes</p>
            <p className='text'>{blog.comment_count} comments</p>
            <p className='text'>{blog.read_time} min read</p>
        </div>
        <div className='vl'></div>
        <div className='col-2'>
            <div className='single-line'>
                <Link className='header-link' to={`/blog/${blog.blog_id}`}><h4>{blog.blog_title}</h4> </Link>  
            </div>
            <p className='blog-text'>{blog.short_blog_description}</p>
        </div>
        <div className='col-3'>
            <p> <span style={{color:'blue'}}> {blog.username} </span> posted {timeDifference(blog.timestamp)}</p>
        </div>
    </Paper>
);}

export default BlogCard;