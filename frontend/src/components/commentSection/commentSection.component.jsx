import { useEffect, useState } from "react";
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
            <div style={{padding:'10px 10px 10px 10px'}}>
            {
                comments.map((comment)=>{
                    const x = `   - <span class='color-blue'>${comment.username} </span> <span class='size-smaller'>${timeDifference(comment.timestamp)}</span>` 
                    return(
                        <div className="comment-outer" key={comment.comment_id}>
                            <div className="horizontal-line-1"/>
                            <div className="comment-div" dangerouslySetInnerHTML={{__html: '<p>' + comment.comment_content + x +'</p>' }} />
                            <div style={{display:'flex',justifyContent:'right'}}> 
                                   
                            </div>
                        </div>
                    )})}
        </div>:null}
        <CommentEditor comments={comments} setComments={setComments} question_id={question_id} answer_id={answer_id} blog_id={blog_id}/>
        </>
        )
}
export default CommentSection;