import './questionPage.style.css';
import { useEffect, useState, useContext } from 'react';
import { Chip, CircularProgress, Grid, IconButton, Paper } from '@mui/material';
import timeDifference from '../../helper/time-difference'
import AnswerSection from '../../components/answerSection/answerSection.component'
import CommentSection from '../../components/commentSection/commentSection.component';
import RelatedQuestions from '../../components/relatedQuestions/relatedQuestions.component';
import { AccountContext } from "../../Account/Account.context";
import { useNavigate, useParams } from 'react-router-dom';
import VoteComponent from '../../components/vote/vote.component';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';
import { Button } from 'react-bootstrap';

const QuestionPage = ()=>{
    const {session} = useContext(AccountContext);
    const user_id = session.idToken.payload.sub;
    const [data,setData] = useState({});
    const {question_id} =useParams();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(()=>{
        const {setButtonGroupView} = bindActionCreators(actionCreators,dispatch);
        setButtonGroupView('questions')
    },[])


    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_question',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
            body: JSON.stringify({question_id:question_id})
            })
            .then(response => response.json())
            .then(data => { 
                console.log(data);
                if(data.status===400){
                    navigate('/invalid')
                };  
                setData(data)})
            .catch(err=>{console.log(err); navigate('/invalid')})
    },[question_id])

    const handelEdit = ()=>{
        navigate('/create_question',{state:data});
    }
    const handleDelete = ()=>{
        const item ={
          user_id: user_id,
          question_id: question_id,
          parent_id: question_id,
          parent:'question'
        }
        if(window.confirm('Are you sure you want to delete this question?')){
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
                onClick={navigate('/questions')}> get back to recent questions </Button>
    </div>
    }


    if(data.question_description===undefined)
        return <div style={{display:'flex',flexDirection:'row',flexGrow:1,justifyContent:'center',paddingTop:'20px'}}><CircularProgress /></div>
        
    return (
        <div className='content-column'>
            <div style={{display:'flex',flexDirection:'row',flexGrow:1}}>
                <div className='left-column' style={{flexDirection:'column',flexGrow:1}}>
                    {user_id===data.user_id?
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div style={{flexGrow:1}}/>
                            <IconButton onClick={handelEdit} title='Edit'>
                                <EditIcon style={{color:'#003060'}} fontSize='large'/>
                            </IconButton>
                            <IconButton onClick={handleDelete} title='Delete'>
                                <DeleteIcon style={{color:'#E7625F'}} fontSize='large'/>
                            </IconButton>
                         </div>:null}
                    <div style={{paddingLeft:'10px',flexGrow:1}}>
                        <h3>{data.question_title}</h3>
                        <p className='time-text'>Asked by <span className='user-text'>{data.username}</span> {timeDifference(data.timestamp)}.</p>       
                    </div>
                    <div className='horizontal-line' />
                    <Paper style={{padding:'20px',flexGrow:1}} elevation={4}> 
                        <div style={{display:'flex',flexDirection:'row'}}>
                            {data.upvotes!==undefined?<VoteComponent voteDisable={user_id===data.user_id} type={"question"} id={data.question_id} vote_count={data.upvotes-data.downvotes}/>:null}
                            <div className='description-div' dangerouslySetInnerHTML={{__html:data.question_description}}></div>
                        </div>
                        <Grid container spacing={1}>
                            {data.tags?data.tags.map(key => (
                                <Grid item key={key}>
                                    <Chip style={{fontSize:'12px'}} label={key} />
                                </Grid>)):null}
                        </Grid>
                        {data.comment_ids!==undefined?<CommentSection question_id={data.question_id} comment_ids={data.comment_ids}/>:null}
                    </Paper>
                    {data.answer_ids!==undefined?<AnswerSection accepted_id={data.accepted_id} question_id={data.question_id} answer_ids={data.answer_ids}/>:null}
                    </div>
                    <Paper elevation={6} className="right-column" >
                        {data.question_id!==undefined?<RelatedQuestions question_id={question_id}/>:null}
                    </Paper>
                </div>
            </div>
    )
}
export default QuestionPage;