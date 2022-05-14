import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { IconButton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../Account/Account.context';
import './vote.style.css';

const VoteComponent = ({vote_count,type,id,voteDisable})=>{
    const {session} = useContext(AccountContext);
    const [voted,setVoted]= useState(0);
    const [vote_cnt,setVoteCnt]= useState(vote_count);
    const user_id = session.idToken.payload.sub
    useEffect(()=>{
        
        if(id!==undefined){
            const postfix = "?type="+type+"&id="+id+"&user_id="+user_id;
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
      },[id,user_id,type]);
    
      useEffect(()=>{
        setVoteCnt(vote_count)
      },[vote_count])

    const post_vote = (vote) =>{
        var data = {};
        if (type==='question'){
            data.question_id = id
        }else if(type==='answer'){
            data.answer_id = id
        }

        console.log(id);

        data.value = vote;
        data.previous = voted;
        data.user_id = session.idToken.payload.sub;
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

    const downvote = ()=>{
        var vote;
        if(voted!==-1){ vote = -1 } else{ vote = 0; }
        post_vote(vote)
    };

    const upvote = ()=>{
        var vote;
        if(voted!==1){ vote = 1 } else{ vote = 0; }
        post_vote(vote)
    };

    return <div style={{display:'flex',flexDirection:'column',minWidth:'60px',marginLeft:'-12px'}}>
        <IconButton disabled={voteDisable} onClick={upvote}>
            <KeyboardArrowUpIcon style={voted===1?{color:'#00b300'}:{}} className="icon-display" fontSize='large'/>
        </IconButton>
        <div className='vote-count' > <p>{vote_cnt}</p> </div>
        <IconButton disabled={voteDisable} onClick={downvote} style={{marginTop:'-20%'}}>
            <KeyboardArrowDownIcon  style={voted===-1?{color:'#ff4d4d'}:{}} className="icon-display"  fontSize='large'/>
        </IconButton>
        </div>
}

export default VoteComponent;