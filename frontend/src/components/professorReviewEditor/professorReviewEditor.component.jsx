import { Chip, FormControl, InputLabel, MenuItem, Select, Slider,Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import RichPlainTextEditor from "../summernotePlainTextEditor/sumernotePlainTextEditor";
import './professorReviewEditor.style.css';
const ProfessorReviewEditor = ({user_id,professor_id,professor_name})=>{

    const [difficulty, setDifficulty]= useState(3);
    const [quality, setQuality]= useState(3);
    const [rating,setRating] = useState(3);
    const [grade,setGrade] = useState('A+');
    const [willTakeAgain,setWillTakeAgain] = useState('yes');
    const [attendance,setAttendance] = useState('mandatory');
    const [forCredit,setForCredit] =useState('yes');
    const [online,setOnline] = useState('yes');
    const [experience,setExperience] = useState('awesome');
    const [review,setReview] = useState('');
    const [disableBtn,setDisableBtn] = useState(true);
    useEffect(() => {
        if(review.replace( /(<([^>]+)>)/ig, '')
                        .replace(/&nbsp;/gi,'')
                        .replace(/\s/g ,'').length < 10 ){
            setDisableBtn(true)
        }
        else{
            setDisableBtn(false)
        }

    }, [review])


    return <div style={{display:'flex', flexDirection:'column',margin:'20px'}}>
                <p style={{fontSize:'24px',marginBottom:'-5px'}}>Rate: <span style={{fontWeight:'bolder'}}>{professor_name}</span></p>
                <div className="professor-review-item" >
                    <InputLabel className="professor-review-label" htmlFor='rating-slider'>
                        <span style={{fontSize:'16px',fontWeight:'bolder'}}>Rating:</span>
                    </InputLabel>                
                    <Slider
                        id='rating-slider' 
                        sx={{maxWidth:'300px'}}
                        aria-label="Quality"
                        defaultValue={3}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={5}
                        onChangeCommitted={(_,value)=>{setRating(value)}}
                    />
                    &nbsp;&nbsp;&nbsp;
                    <Chip label={<p style={{margin:'1px',fontSize:'14px'}}>{rating}</p>}/>  
                </div>
                <div className="professor-review-item" >
                        <InputLabel className="professor-review-label" htmlFor='difficulty-slider'>
                            <span style={{fontSize:'16px',fontWeight:'bolder'}}>Difficulty:</span>
                        </InputLabel>                
                        <Slider
                            id='difficulty-slider' 
                            sx={{maxWidth:'300px'}}
                            aria-label="Difficulty"
                            defaultValue={3}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={1}
                            max={5}
                            onChangeCommitted={(_,value)=>{setDifficulty(value)}}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <Chip label={<p style={{margin:'1px',fontSize:'14px'}}>{difficulty}</p>}/>
                </div>
                <div className="professor-review-item" >
                        <InputLabel className="professor-review-label" htmlFor='quality-slider'>
                            <span style={{fontSize:'16px',fontWeight:'bolder'}}>Quality:</span>
                        </InputLabel>                
                        <Slider
                            id='quality-slider' 
                            sx={{maxWidth:'300px'}}
                            aria-label="Quality"
                            defaultValue={3}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={1}
                            max={5}
                            onChangeCommitted={(_,value)=>{setQuality(value)}}
                        />
                        &nbsp;&nbsp;&nbsp;
                        <Chip label={<p style={{margin:'1px',fontSize:'14px'}}>{quality}</p>}/>  
                </div>
                <div className="professor-review-item" >
                    <Grid style={{marginTop:'3px'}} container spacing={2}>
                        <Grid item >
                            <FormControl>
                                <InputLabel style={{top:'-3px'}} className="professor-review-label">
                                    <span style={{fontSize:'16px',fontWeight:'bolder'}}>Grade</span>
                                </InputLabel>                
                                <Select
                                    value={grade}
                                    onChange={(e)=>{setGrade(e.target.value)}}
                                    sx={{minWidth:'100px',height:'40px'}}
                                    label='***********'
                                    >
                                    <MenuItem value={'A+'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;A+</span></MenuItem>
                                    <MenuItem value={'A'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;A</span></MenuItem>
                                    <MenuItem value={'A-'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;A-</span></MenuItem>
                                    <MenuItem value={'B+'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;B</span></MenuItem>
                                    <MenuItem value={'B'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;B+</span></MenuItem>
                                    <MenuItem value={'B-'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;B-</span></MenuItem>
                                    <MenuItem value={'C'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;C</span></MenuItem>
                                    <MenuItem value={'C-'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;C-</span></MenuItem>
                                    <MenuItem value={'D'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;D</span></MenuItem>
                                    <MenuItem value={'F'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;F</span></MenuItem>
                                </Select> 
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <FormControl>
                                <InputLabel style={{top:'-3px'}} className="professor-review-label">
                                    <span style={{fontSize:'16px',fontWeight:'bolder'}}>Will Take Again</span>
                                </InputLabel>                
                                <Select
                                    value={willTakeAgain}
                                    onChange={(e)=>{setWillTakeAgain(e.target.value)}}
                                    sx={{minWidth:'140px',height:'40px'}}
                                    label='*****************************'
                                    >
                                    <MenuItem value={'yes'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Yes</span></MenuItem>
                                    <MenuItem value={'no'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;No</span></MenuItem>
                                </Select> 
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <FormControl>
                                <InputLabel style={{top:'-3px'}} className="professor-review-label">
                                    <span style={{fontSize:'16px',fontWeight:'bolder'}}>Attendance</span>
                                </InputLabel>                
                                <Select
                                    value={attendance}
                                    onChange={(e)=>{setAttendance(e.target.value)}}
                                    sx={{minWidth:'100px',height:'40px'}}
                                    label='*********************'
                                    >
                                    <MenuItem value={'mandatory'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Mandatory</span></MenuItem>
                                    <MenuItem value={'not mandatory'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Not Mandatory</span></MenuItem>
                                </Select> 
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <FormControl>
                                <InputLabel style={{top:'-3px'}} className="professor-review-label">
                                    <span style={{fontSize:'16px',fontWeight:'bolder'}}>For Credit</span>
                                </InputLabel>                
                                <Select
                                    value={forCredit}
                                    onChange={(e)=>{setForCredit(e.target.value)}}
                                    sx={{minWidth:'100px',height:'40px'}}
                                    label='*******************'
                                    >
                                    <MenuItem value={'yes'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Yes</span></MenuItem>
                                    <MenuItem value={'no'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;No</span></MenuItem>
                                </Select> 
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <FormControl>
                                <InputLabel style={{top:'-3px'}} className="professor-review-label">
                                    <span style={{fontSize:'16px',fontWeight:'bolder'}}>Online</span>
                                </InputLabel>                
                                <Select
                                    value={online}
                                    onChange={(e)=>{setOnline(e.target.value)}}
                                    sx={{minWidth:'80px',height:'40px'}}
                                    label='************'
                                    >
                                    <MenuItem value={'yes'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Yes</span></MenuItem>
                                    <MenuItem value={'no'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;No</span></MenuItem>
                                </Select> 
                            </FormControl>
                        </Grid>
                        <Grid item >
                            <FormControl>
                                <InputLabel style={{top:'-3px'}} className="professor-review-label">
                                    <span style={{fontSize:'16px',fontWeight:'bolder'}}>Overall Experience</span>
                                </InputLabel>                
                                <Select
                                    value={experience}
                                    onChange={(e)=>{setExperience(e.target.value)}}
                                    sx={{minWidth:'160px',height:'40px'}}
                                    label='************************************'
                                    >
                                    <MenuItem value={'awesome'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Awesome</span></MenuItem>
                                    <MenuItem value={'average'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Average</span></MenuItem>
                                    <MenuItem value={'awful'}><span style={{padding:'5px',fontSize:'12px'}}>&nbsp;Awful</span></MenuItem>
                                </Select> 
                            </FormControl>
                        </Grid>
                    </Grid> 
                </div>
                <InputLabel style={{marginTop:'30px'}} className="professor-review-label" htmlFor='rating-slider'>
                            <span style={{fontSize:'16px',fontWeight:'bolder'}}>Review:</span>
                </InputLabel>       
                <RichPlainTextEditor setContent={setReview} height={200}/>
                <div style={{display:'flex',flexDirection:'row',flexGrow:1}}>
                    <div style={{flexGrow:1}}/>
                    <Button disabled={disableBtn} sx={{fontSize:'14px'}} variant="contained">Submit</Button>
                </div>
            </div>
}
export default ProfessorReviewEditor;