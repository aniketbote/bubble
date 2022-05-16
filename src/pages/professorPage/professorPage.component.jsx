import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Chip, Grid, Paper, IconButton, Button} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import './professorPage.style.css'
import DeleteIcon from '@mui/icons-material/Delete';
import { AccountContext } from "../../Account/Account.context";
import timeDifference from "../../helper/time-difference";
import ProfessorReviewEditor from "../../components/professorReviewEditor/professorReviewEditor.component";
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';

const ProfessorPage = ()=>{
    const {id} = useParams('id');
    const [professor,setProfessor] = useState({});
    const [reviews,setReview] = useState([]);
    const [difficulty,setDifficulty] = useState(null);
    const [quality,setQuality] = useState(null);
    const [takeAgain,setTakeAgain] = useState(null);
    const [attendance,setAttendance] = useState(null);
    const [forCredit,setForCredit] = useState(null);
    const [online,setOnline] = useState(null);
    const [reviewEditorVisible,setReviewEditorVisible] = useState(false);
    const [userHasReviewed,setUserHasReviewed] = useState(false);
    const {session} = useContext(AccountContext);
    const user_id = session.idToken.payload.sub;

    
    const dispatch = useDispatch();
    useEffect(()=>{
        const {setButtonGroupView} = bindActionCreators(actionCreators,dispatch);
        setButtonGroupView('FAP')
    },[])
    useEffect(()=>{
        fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/get_professor',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body:JSON.stringify({professor_id:id})
        })
        .then(response=>response.json())
        .then(response=>{
            console.log(response)
            response.num_ratings = response.reviews.length
                setProfessor(response);
                fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/get_reviews',{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*'
                    },
                    body:JSON.stringify({review_ids:response.reviews})
                })
                .then(response=>response.json())
                .then(response=>{console.log(response);setReview(response)})
            })
    },[id])

    const fetchData = ()=>{
        fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/get_professor',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body:JSON.stringify({professor_id:id})
        })
        .then(response=>response.json())
        .then(response=>{
                setProfessor(response);
                fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/get_reviews',{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*'
                    },
                    body:JSON.stringify({review_ids:response.reviews})
                })
                .then(response=>response.json())
                .then(response=>{setReview(response)})
            })
    }

    useEffect(()=>{
        if(professor.num_ratings>0){
            setDifficulty(round(reviews.map(review => review.difficulty).reduce((a, b) => a + b, 0)/professor.num_ratings,1));
            setQuality(round(reviews.map(review => review.quality).reduce((a, b) => a + b, 0)/professor.num_ratings,1));
            setTakeAgain(mode(reviews.map(review => review.take_again)))
            setAttendance(mode(reviews.map(review => review.attendance)))
            setOnline(mode(reviews.map(review => review.online)))
            setForCredit(mode(reviews.map(review => review.for_credit)))
            reviews.every(review=>{
                if(review.user_id===user_id){
                   setUserHasReviewed(true);
                   return false;
                }
                return true;
            })
        }
    },[reviews,professor.num_ratings,user_id])

    if(professor.num_ratings!==0){
        var awful_percent   = professor.rating_type_counts!==undefined?roundInt(professor.rating_type_counts.awful_count/professor.num_ratings*100,2):0;
        var awesome_percent = professor.rating_type_counts!==undefined?roundInt(professor.rating_type_counts.awesome_count/professor.num_ratings*100,2):0;
        var average_percent = professor.rating_type_counts!==undefined?roundInt(professor.rating_type_counts.average_count/professor.num_ratings*100,2):0;
    }
    else{
        awful_percent   = 0;
        awesome_percent = 0;
        average_percent = 0;
    }
    const onReviewButtonClick = ()=>{
        setReviewEditorVisible(true);
        setTimeout(() => {
            document.getElementById('review-editor-area').scrollIntoView({ 
                behavior: 'smooth',
                block: 'center',
                inline: 'center'});
        }, 100);
    }
    
    const deleteHandler = (review_id)=>{
        const data ={
          user_id: user_id,
          review_id: review_id,
          parent_id: review_id,
          parent:'review'
        }
        if(window.confirm('Are you sure you want to delete this review?')){
          fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/delete',{
            method:'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(() => {fetchData();userHasReviewed(false)})
            .catch(err=>{console.log(err)})
        }
    }
    

    return professor?<div className="professor-div">
            <div  className="professor-div">
            {!userHasReviewed?
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div style={{flexGrow:1}}/>
                        <Button onClick={()=>{onReviewButtonClick()}} style={{fontSize:'16px',margin:'10px'}}>Write A Review</Button> 
                         </div>:null}
                <div style={{display:'flex',flexDirection:'row',flexGrow:1,justifyContent:'center'}}>
                    <Paper elevation={5} className="professor-details-box">
                        <h2 className="professor-rating">{professor.total_rating!==0?round(professor.total_rating/professor.num_ratings,1)+'/5.0':'N/A'}  </h2>
                        <p className="professor-rating-count" style={{marginTop:'-10px'}}>Overall Quality Based on <span style={{fontWeight:'600'}}>{professor.num_ratings}</span> Ratings.</p>
                        <h1 className="professor-name-header">{professor.first_name} {professor.last_name}</h1>
                        <div  style={{display:'flex',flexDirection:'row',marginTop:'25px'}}>
                            <div><p className="rating_type"> Awesome:</p> </div>
                            <div style={{flexGrow:1}} >
                                <LinearProgress color="primary" variant="determinate" value={awesome_percent} />
                                <LinearProgress color="primary" variant="determinate" value={awesome_percent} />
                                <LinearProgress color="primary" variant="determinate" value={awesome_percent} />
                                <LinearProgress color="primary" variant="determinate" value={awesome_percent} />
                            </div>
                            <div><p className="rating_percent">&nbsp; {awesome_percent}%</p> </div>
                        </div>
                        <div  style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                            <div ><p className="rating_type"> Average: </p> </div>
                            <div style={{flexGrow:1}} >
                                <LinearProgress color="warning" variant="determinate" value={average_percent} />
                                <LinearProgress color="warning" variant="determinate" value={average_percent} />
                                <LinearProgress color="warning" variant="determinate" value={average_percent} />
                                <LinearProgress color="warning" variant="determinate" value={average_percent} />
                            </div>
                            <div><p className="rating_percent">&nbsp; {average_percent}%</p> </div>
                        </div>
                        <div  style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                            <div><p className="rating_type">Awful:</p></div>
                            <div style={{flexGrow:1}}>
                                <LinearProgress color="error" variant="determinate" value={awful_percent} />
                                <LinearProgress color="error" variant="determinate" value={awful_percent} />
                                <LinearProgress color="error" variant="determinate" value={awful_percent} />
                                <LinearProgress color="error" variant="determinate" value={awful_percent} />
                            </div>
                            <div><p className="rating_percent">&nbsp; {awful_percent}%</p> </div>
                        </div>
                        <Grid style={{margin:'10px 0px'}} container spacing={1.5}>

                            {difficulty!=null?<Grid item >   
                                <Chip label={<span className="chip-text">Difficulty: <span style={{fontWeight:600}}>{difficulty}/5.0</span></span>}/>
                            </Grid>:<></>}    
                            {quality!=null?<Grid item >   
                                <Chip label={<span className="chip-text">Quality: <span style={{fontWeight:600}}>{quality}/5.0</span></span>}/>
                            </Grid>:<></>} 
                            {takeAgain!=null?<Grid item >   
                                <Chip label={<span className="chip-text">Will take again: <span style={{fontWeight:600}}>{takeAgain}</span></span>}/>
                            </Grid>:<></>}    
                            {attendance!=null?<Grid item >   
                                <Chip label={<span className="chip-text">Attendance: <span style={{fontWeight:600}}>{attendance}</span></span>}/>
                            </Grid>:<></>}   
                            {forCredit!=null?<Grid item >   
                                <Chip label={<span className="chip-text">For credit: <span style={{fontWeight:600}}>{forCredit}</span></span>}/>
                            </Grid>:<></>}   
                            {online!=null?<Grid item >   
                                <Chip label={<span className="chip-text">Online: <span style={{fontWeight:600}}>{online}</span></span>}/>
                            </Grid>:<></>}                  
                        </Grid>
                    </Paper>
                </div>
            </div>
            {professor.num_ratings>0?<h3 style={{margin:'10px 50px -20px 50px', padding:'20px 0px'}}>Review count: {professor.num_ratings}</h3>:null}
                <Paper elevation={6} style={{margin:'20px'}}>
                    <div style={{flexGrow:3}} className="professor-div">
                        <div style={{justifyContent:'center'}} className="professor-col-div">
                            <div style={{width:'100%'}}>
                                {
                                    reviews.map( review =>{
                                    if(review.tags==='awful'){
                                            var color1='#FF9A98';
                                            var color2='#FFDDDC';
                                    }else if(review.tags==='average'){
                                            color1='#FFF59E';
                                            color2='#FFFEE9';
                                    }else{
                                        color1='#B7E9F7';
                                        color2='#E9FAFF';
                                    }
                                    return professor.num_ratings>0?
                                            <Paper id={review.review_id} key={review.review_id} style={{margin:'30px 50px',padding:'10px',background: color2}} elevation={5}>
                                                
                                                    <div style={{display:'flex',flexDirection:'row'}}>
                                                        <div style={{flexGrow:1}}>
                                                            <Grid container spacing={1}>
                                                                <Grid item >   
                                                                    <Chip style={{background: color1}} label={<span className="chip-text"><span style={{fontWeight:600}}>{review.tags}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >   
                                                                    <Chip label={<span className="chip-text">Grade: <span style={{fontWeight:600}}>{review.grade}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >   
                                                                    <Chip label={<span className="chip-text">Difficulty: <span style={{fontWeight:600}}>{review.difficulty}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >   
                                                                    <Chip label={<span className="chip-text">Quality: <span style={{fontWeight:600}}>{review.quality}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >
                                                                    <Chip label={<span className="chip-text">Will take again: <span style={{fontWeight:600}}>{review.take_again}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >    
                                                                    <Chip label={<span className="chip-text">Attendance: <span style={{fontWeight:600}}>{review.attendance}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >   
                                                                    <Chip label={<span className="chip-text">Rating: <span style={{fontWeight:600}}>{review.rating}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >                                               
                                                                    <Chip label={<span className="chip-text">For Credit: <span style={{fontWeight:600}}>{review.for_credit}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >   
                                                                    <Chip label={<span className="chip-text">Online: <span style={{fontWeight:600}}>{review.online}</span></span>}/>
                                                                </Grid>
                                                                <Grid item >   
                                                                    <Chip label={<span className="chip-text">Sentiment: <span style={{fontWeight:600}}>{review.review_sentiment}</span></span>}/>
                                                                </Grid>
                                                            </Grid>
                                                          </div>
                                                        {user_id===review.user_id?
                                                        <div>
                                                            <IconButton onClick={()=>{deleteHandler(review.review_id)}} title='Delete'>
                                                                <DeleteIcon style={{color:'#E7625F'}} fontSize='large'/>
                                                            </IconButton>
                                                        </div>
                                                        :null}
                                                    </div>
                                                <div className="reviewText" dangerouslySetInnerHTML={{__html:review.review}} />
                                                <div style={{display:'flex',flexDirection:'row'}}>
                                                    <div style={{flexGrow:1}}/>
                                                    <p style={{marginBottom:'-5px',marginTop:'3px'}} className="time-text">Posted {timeDifference(review.timestamp)}. </p>
                                                </div>
                                            </Paper>:<></>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Paper>
                {reviewEditorVisible&&!userHasReviewed?<Paper elevation={6} id='review-editor-area'> 
                                <ProfessorReviewEditor fetchData={fetchData} user_id={user_id} professor_id={id} professor_name={professor.first_name+' '+professor.last_name}/>
                </Paper>:null}
    </div>:<></>
}
export default ProfessorPage;


function round(value, precision) {
    return value.toFixed(precision);
}
function roundInt(value, precision) {
    return parseInt(value.toFixed(precision));
}
function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}