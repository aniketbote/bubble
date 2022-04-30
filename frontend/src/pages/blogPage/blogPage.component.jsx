import './blogPage.style.css';
import { useEffect, useState,useContext } from 'react';
import { Chip, Grid, Paper } from '@mui/material';
import timeDifference from '../../helper/time-difference'
import { AccountContext } from '../../Account/Account.context';
import CommentSection from '../../components/commentSection/commentSection.component';
import { useParams } from 'react-router-dom';
const BlogPage = ()=>{
    const {session} = useContext(AccountContext);
    const [data,setData] = useState({});
    const {blog_id} = useParams();
    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_blog',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
            body: JSON.stringify({blog_id:blog_id})
            })
            .then(response => response.json())
            .then(data => {console.log(data); setData(data)})
    },[blog_id])
    
    return (
        <div className='blogPageContainer'>
                <div className='content-column'>
                    <div style={{display:'flex',flexDirection:'row',flexGrow:1}}>
                    <div style={{flexDirection:'column',flexGrow:1}}>
                        <div style={{paddingLeft:'10px',flexGrow:1}}>
                            <h3>{data.blog_title}</h3>
                            <p className='time-text'> by <span className='user-text'>{data.username}</span> {timeDifference(data.timestamp)}.</p>       
                        </div>
                        <div className='horizontal-line' />
                        <Paper style={{padding:'20px',flexGrow:1}} elevation={4}>
                            <div className='description-div' dangerouslySetInnerHTML={{__html:data.blog_content}}></div>
                            <Grid container spacing={1}>
                                {data.tags?data.tags.map(key => (
                                    <Grid item key={key}>
                                        <Chip style={{fontSize:'12px'}} label={key} />
                                    </Grid>)):null}
                            </Grid>
                            {data.comment_ids!==undefined?<CommentSection blog_id={data.blog_id} comment_ids={data.comment_ids}/>:null}
                        </Paper>
                    </div>
                    <Paper elevation={6} className="right-column" ></Paper>
                    </div>
                </div>
                
        </div>     
    )
}
export default BlogPage;