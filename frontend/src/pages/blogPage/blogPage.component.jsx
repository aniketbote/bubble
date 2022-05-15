import './blogPage.style.css';
import { useEffect, useState,useContext } from 'react';
import { Button, Chip, CircularProgress, Grid, IconButton, Paper } from '@mui/material';
import timeDifference from '../../helper/time-difference'
import { AccountContext } from '../../Account/Account.context';
import CommentSection from '../../components/commentSection/commentSection.component';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlogLikes from '../../components/blogLikeSection/blogLikeSection.component';
import RelatedBlogs from '../../components/relatedBlogs/relatedBlogs';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';

const BlogPage = ()=>{
    const {session} = useContext(AccountContext);
    const [data,setData] = useState({});
    const {blog_id} = useParams();
    const navigate = useNavigate();
    var user_id=session.idToken.payload.sub;

    const dispatch = useDispatch();
    useEffect(()=>{
        const {setButtonGroupView} = bindActionCreators(actionCreators,dispatch);
        setButtonGroupView('blogs')
    },[])

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
            .then(data => {console.log(data);
                if(data.status===400){
                    navigate('/invalid')
                }; 
                setData(data)})
            .catch(err=>{console.log(err); navigate('/invalid')})
    },[blog_id])

    const handleEdit = ()=>{
        navigate('/create_blog',{state:data});
    }
    const handleDelete = ()=>{
        const item ={
          user_id: data.user_id,
          blog_id: blog_id,
          parent_id: blog_id,
          parent:'blog'
        }
        if(window.confirm('Are you sure you want to delete this blog?')){
            fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/delete',{
                method:'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                  },
                body: JSON.stringify(item)
                })
                .then(response => response.json())
                .then(() => {navigate('/')})
                .catch(err=>{console.log(err)})
        }

     }
     if(data.deleted){
         return <div style={{padding:'15px'}}>
         <h3>This content has deleted because one of the following reasons.</h3>
         <ul>
             <li> The content was deleted by the owner himself/herself.</li>
             <li> One of our moderator find this content inappropriate.</li>
             <li> Out system detected some explicit or inappropriate media inside the content.</li>
         </ul>
         <Button style={{fontSize:'small'}} 
                 variant='text' 
                 size='large'
                 onClick={navigate('/blogs')}> get back to recent blogs </Button>
     </div>
     }

    if(data.blog_content===undefined)
        return <div style={{display:'flex',flexDirection:'row',flexGrow:1,justifyContent:'center',paddingTop:'20px'}}><CircularProgress /></div>
        
    return (

        <div className='content-column'>
            <div style={{display:'flex',flexDirection:'row',flexGrow:1}}>
            <div className='left-column' style={{flexDirection:'column',flexGrow:1}}>
            {user_id===data.user_id?
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div style={{flexGrow:1}}/>
                            <IconButton onClick={handleEdit} title='Edit'>
                                <EditIcon  style={{color:'#003060'}} fontSize='large'/>
                            </IconButton>
                            <IconButton onClick={handleDelete} title='Delete'>
                                <DeleteIcon style={{color:'#E7625F'}} fontSize='large'/>
                            </IconButton>
                         </div>:null}
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
                    <div style={{height:'15px'}}/>
                    <BlogLikes blog_id={data.blog_id} vote_count={data.upvotes}/>
                    {data.comment_ids!==undefined?<CommentSection blog_id={data.blog_id} comment_ids={data.comment_ids}/>:null}
                </Paper>
            </div>
            <Paper elevation={6} className="right-column" >
                <RelatedBlogs blog_id={blog_id}/>
            </Paper>
            </div>
        </div>
    )
}
export default BlogPage;