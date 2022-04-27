import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import './commentSection.style.css';
import timeDifference from "../../helper/time-difference";
import CommentEditor from "../commentEditor/commentEditor.component";

const CommentSection = ({answer_id,question_id,blog_id,comment_ids}) =>{
    const [comments,setComments] = useState([]);
    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_comment',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
            body: JSON.stringify({comment_ids:comment_ids})
            })
            .then(response => response.json())
            .then(data => { setComments(data)})
    },[comment_ids])
    return(
        <>
        {comment_ids.length > 0 ?
            <div style={{padding:'20px 4% 10px 4%'}}>
            {
                comments.map((comment)=>{
                    return(
                        <div className="comment-outer" key={comment.comment_id}>
                            <div className="horizontal-line-1"/>
                            <div className="comment-div" dangerouslySetInnerHTML={{__html:'<p>'+DOMPurify.sanitize(comment.comment_content)+'</p>'}} />
                            <div style={{display:'flex',justifyContent:'right'}}> 
                                <p style={{fontSize:'12px'}} className='time-text'>commented by  
                                    <span className='user-text'> {comment.username} </span> 
                                    {timeDifference(comment.timestamp)}.
                                </p>     
                            </div>
                        </div>
                    )})}
        </div>:null}
        <CommentEditor question_id={question_id} answer_id={answer_id} blog_id={blog_id}/>
        </>
        )
}
export default CommentSection;