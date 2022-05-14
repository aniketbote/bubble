import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import './relatedBlogs.scss';
import { CircularProgress } from "@mui/material";

const RelatedBlogs = ({blog_id}) =>{
    const [blogs,setBlogs] = useState([]);
    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_related_blogs?blog_id='+blog_id,{
            method:'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            }
            })
            .then(response => response.json())
            .then(data => {console.log(data) ; setBlogs(data)})
    },[blog_id])
    
    if(blogs.length<1)
        return <div style={{display:'flex',flexDirection:'row',flexGrow:1,justifyContent:'center',paddingTop:'20px'}}><CircularProgress /></div>

        
    return <div className="related-blogs-div">
                <p className='header' >Related Blogs</p>
                {
                    blogs.length>0?
                    <ul className='related-list'>
                        {
                            blogs.map((blog)=>{
                                return  <li key={blogs.blogs_id} >
                                            <div style={{display:'flex'}}>
                                                <Chip style={{fontSize:'10px',paddingTop:'3px',minWidth:'40px'}} 
                                                      label={blog.vote_count} 
                                                      size="small" variant="outlined" />
                                                <Link className="rel-question-link" to={'/blog/'+blog.blog_id}> <p className="blog-list-text">{blog.blog_title}</p> </Link> 
                                            </div>
                                            <div style={{height:'15px'}}/>
                                        </li>
                            })
                        }
                    </ul>:null   
                }                
           </div>
}

export default RelatedBlogs;

