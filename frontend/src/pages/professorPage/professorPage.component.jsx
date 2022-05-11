import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Chip, Grid, Paper} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import './professorPage.style.css'
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

    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_professor',{
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
                console.log(response);
                fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_reviews',{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*'
                    },
                    body:JSON.stringify({review_ids:response.reviews})
                })
                .then(response=>response.json())
                .then(response=>{setReview(response);console.log(response)})
            })
    },[id])

    useEffect(()=>{
        if(professor.num_ratings>0){
            setDifficulty(round(reviews.map(review => review.difficulty).reduce((a, b) => a + b, 0)/professor.num_ratings,1));
            setQuality(round(reviews.map(review => review.quality).reduce((a, b) => a + b, 0)/professor.num_ratings,1));
            setTakeAgain(mode(reviews.map(review => review.take_again)))
            setAttendance(mode(reviews.map(review => review.attendance)))
            setOnline(mode(reviews.map(review => review.online)))
            setForCredit(mode(reviews.map(review => review.for_credit)))
        }
    

    },[reviews])
    if(professor.num_ratings!==0){
        var awful_percent   = professor.rating_type_counts!==undefined?round(professor.rating_type_counts.awful_count/professor.num_ratings*100,2):0;
        var awesome_percent = professor.rating_type_counts!==undefined?round(professor.rating_type_counts.awesome_count/professor.num_ratings*100,2):0;
        var average_percent = professor.rating_type_counts!==undefined?round(professor.rating_type_counts.average_count/professor.num_ratings*100,2):0;
    }
    else{
        awful_percent   = 0;
        awesome_percent = 0;
        average_percent = 0;
    }
    

    return professor?<div className="professor-div">
            <div  className="professor-div">
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
                <Paper elevation={6} style={{margin:'20px'}}>
                    {professor.num_ratings>0?<h3 style={{margin:'10px 50px',padding:'20px 0px'}}>Review count: {professor.num_ratings}</h3>:null}
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
                                    return <Paper key={review.review_id} style={{margin:'10px 50px',padding:'10px',background: color2}} elevation={5}>
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
                                                <div className="reviewText" ><p>{review.review}</p></div>
                                            </Paper>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Paper>
    </div>:<></>
}
export default ProfessorPage;


function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}