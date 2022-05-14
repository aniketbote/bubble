import { Chip, IconButton } from "@mui/material";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../Account/Account.context";
 
const BlogLikes = ({vote_count,blog_id,voteDisable})=>{
    
    const {session} = useContext(AccountContext);
    const [voted,setVoted]= useState(0);
    const [vote_cnt,setVoteCnt]= useState(vote_count);
    const user_id = session.idToken.payload.sub
    useEffect(()=>{
        if(blog_id!==undefined){
            const postfix = "?type=blog&id="+blog_id+"&user_id="+user_id;
            fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_vote_val'+postfix,{
              method:'GET', 
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin':'*'
                }           
             })
              .then(response => response.json())
              .then(data => {console.log();setVoted(data)})
              .catch(err=>{console.log(err)})
        }
      },[blog_id,user_id]);
    
      useEffect(()=>{
        setVoteCnt(vote_count)
      },[vote_count])

    const post_vote = (vote) =>{
        var data = {
            blog_id: blog_id,
            value: vote,
            previous: voted,
            user_id: user_id
        };

        setVoteCnt(vote_cnt+(vote-voted))
        console.log(voted,vote)
        setVoted(vote)

        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/set_vote',{
            method:'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
              body: JSON.stringify(data)       
           })
            .then(response => response.json())
            .then(data => {console.log(data)})
            .catch(err=>{console.log(err)})
    }


    const upvote = ()=>{
        var vote;
        if(voted!==1){ vote = 1 } else{ vote = 0; }
        post_vote(vote)
    };
return <div>
    <IconButton onClick={upvote}  disabled={voteDisable}>
        {voted?<ThumbUpIcon sx={{color:'#4444FF',transform:'scale(1.6)'}}  />:
        <ThumbUpOutlinedIcon sx={{color:'#4444FF',transform:'scale(1.6)'}}/>}
    </IconButton>
    <Chip variant="outlined" sx={voted?{fontSize:'12px',borderColor:'#4444FF'}:{fontSize:'12px'}} label={vote_cnt}/>
    
</div>}


export default BlogLikes;