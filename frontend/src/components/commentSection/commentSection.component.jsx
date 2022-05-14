import { useContext, useEffect, useState } from "react";
import './commentSection.style.css';
import timeDifference from "../../helper/time-difference";
import CommentEditor from "../commentEditor/commentEditor.component";
import { IconButton } from "@mui/material";
import { AccountContext } from "../../Account/Account.context";
import DeleteIcon from '@mui/icons-material/Delete';

const CommentSection = ({answer_id,question_id,blog_id,comment_ids}) =>{
    const [comments,setComments] = useState([]);
    const {session} = useContext(AccountContext);
    const user_id = session.idToken.payload.sub;

    useEffect(()=>{
        if ( comment_ids.length > 0)
        {
            fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_comment',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                  },
                body: JSON.stringify({comment_ids:comment_ids})
                })
                .then(response => response.json())
                .then(data => {setComments(data)})
                .catch(err=>{console.log(err)})
        }
        else{
            setComments([]);
        }

    },[comment_ids])

    const onDelete = (comment)=>{
        const data ={
            user_id: user_id,
            comment_id: comment.comment_id
          }
          if(question_id!==undefined){
            data.parent_id = question_id;
            data.parent = 'question';
          } else if(answer_id!==undefined){
            data.parent_id = answer_id;
            data.parent = 'answer';      
          } else if(blog_id!==undefined){
            data.parent_id = blog_id;
            data.parent = 'blog';
          }
          console.log(data)
          fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/delete',{
              method:'POST', 
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin':'*'
                },
              body: JSON.stringify(data)
              })
              .then(response => response.json())
              .then(() => {setComments(comments.filter((com)=>com!==comment))})
              .catch(err=>{console.log(err)})
    }
    return(
        <>
            <div style={{padding:'10px 10px 10px 10px'}}>
            {
                comments.sort((a,b)=> parseInt(new Date(a.timestamp) - new Date(b.timestamp)))
                .map((comment)=>{
                    const x = `   - <span class='color-blue'>${comment.username} </span> <span class='size-smaller'>${timeDifference(comment.timestamp)}</span>` 
                    return(
                        <div className="comment-outer" key={comment.comment_id}>
                            <div className="horizontal-line-1"/>
                              <div style={{display:'flex',flexDirection:'row'}}>
                                  <div style={{flexGrow:1}} className="comment-div" dangerouslySetInnerHTML={{__html:  `<p> ${comment.comment_content} ${x} </p> `  }} />
                                  {user_id===comment.user_id?
                                  <div>
                                    <IconButton title='Delete' onClick={()=>{onDelete(comment)}}>
                                        <DeleteIcon style={{color:'#E7625F'}} fontSize='medium'/>
                                    </IconButton>
                                  </div>
                                  :null}
                              </div>
                            <div style={{display:'flex',justifyContent:'right'}}> 
                            </div>
                        </div>
                    )})}
            </div>
            <CommentEditor comments={comments} setComments={setComments} question_id={question_id} answer_id={answer_id} blog_id={blog_id}/>
        </>
        )
}
export default CommentSection;