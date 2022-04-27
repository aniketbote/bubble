import RichPlainTextEditor from "../summernotePlainTextEditor/sumernotePlainTextEditor"
import { Button } from "@mui/material";
import { useState, useContext } from "react";
import { AccountContext } from "../../Account/Account.context";

const CommentEditor = ({question_id,answer_id,blog_id,comments,setComments})=>{
    const [showCommentEditor,setShowCommentEditor] = useState(false);
    const [content,setContent] = useState('');
    const {session} = useContext(AccountContext);
    console.log(session);
    console.log(question_id, answer_id,blog_id)
    return(<>
        <Button onClick={()=>{setShowCommentEditor(true)}} style={{fontSize:'12px',marginBottom:'5px'}} variant="text">add a comment</Button>
        {showCommentEditor?<>
            <RichPlainTextEditor setContent={setContent}  height={100}/>
            <div style={{display:'flex',justifyContent:'right'}}>
                <Button style={{fontSize:'14px',marginTop:'-10px'}} variant="contained">Submit</Button>
            </div>
        </>:null}
    </>)
}
export default CommentEditor;