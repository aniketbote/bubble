import { Button, InputLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProfessor = () =>{

    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [disabled,setDisabled] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        if(firstName.length>0 && lastName.length>0){
            setDisabled(false);
        }
        else{
            setDisabled(true);
        }
    },[firstName,lastName]);

    const handleSubmit = ()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/add_professor',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
                },
            body: JSON.stringify({first_name:firstName, last_name: lastName})            
            })
            .then(response => response.json())
            .then(data => {navigate('/find_a_professor')})
    }

    return   <div style={{display:'flex',flexDirection:'column',padding:'10px 20px'}}>
                <div style={{display:'flex',flexDirection:'center',flexGrow:1,justifyContent:'center',marginTop:'100px'}}> 
                    <div style={{border:'1px solid grey', padding:'5px 20px 20px 20px',borderRadius:'10px'}}>
                        <h3>Enter professor details below</h3>
                        <InputLabel style={{margin:'10px 0px',fontSize:'12px',fontWeight:'bolder'}} htmlFor="professor-firstname-input">
                            First Name: &nbsp;
                        </InputLabel>
                        <div style={{display:'flex',flexDirection:'row',flexGrow:1}}>
                            <TextField onChange={(e)=>{setFirstName(e.target.value)}} id='professor-firstname-input' sx={{width:'300px'}} label='First Name'/>
                        </div>
                        <InputLabel style={{margin:'10px 0px',fontSize:'12px',fontWeight:'bolder'}} htmlFor="professor-lastname-input">
                                Last Name: &nbsp;
                            </InputLabel>
                        <div style={{display:'flex',flexDirection:'row',flexGrow:1,paddingBottom:'20px'}}>
                            <TextField onChange={(e)=>{setLastName(e.target.value)}} id='professor-lastname-input' sx={{width:'300px'}} label='Last Name'/>
                        </div>
                        <div >
                            <Button onClick={handleSubmit} disabled={disabled} variant="contained" sx={{fontSize:'12px'}}>Submit</Button>
                        </div>
                    </div>
                </div>
            </div>

}

export default AddProfessor;