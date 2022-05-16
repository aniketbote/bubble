import {Autocomplete, TextField, Button} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';
import Image from './professor.png';

const FAPPage = ()=>{

    const [professorList,setProfessorList] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        const {setButtonGroupView} = bindActionCreators(actionCreators,dispatch);
        setButtonGroupView('FAP')
    },[])

    const search_professor = (value)=>{
        const data = { 
           from:0,
           size:5, 
           query:{  
              query_string:{  
                 fields:["last_name","first_name"],
                 query: "*"+value+"*"
              }}
            }
        fetch('https://search-bubble-domain-rfgwnz5ocgakgdb44********.us-east-1.es.amazonaws.com/professors/_search',
        {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ btoa('#######:***********'),
            },
            body: JSON.stringify(data)
        })
        .then(response=>response.json())
        .then(data=> setProfessorList(data.hits.hits.map(x=>{ return {label : x._source.first_name+' '+x._source.last_name, id: x._source.professor_id}})))
  
    }
    return <>
            <div style={{width:'100%',display:'flex',flexDirection:'row'}}>
                <div style={{display:'flex',flexGrow:1}}/>
                <Button onClick={()=>{navigate('/add_professor')}} color='warning' sx={{fontSize:'12px',margin:'10px'}}>Can't find professor?</Button>
            </div>
            <div style={{display:'flex',flexDirection:'center',flexGrow:1,justifyContent:'center',marginTop:'50px'}}> 
                <div style={{display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',flexDirection:'row',flexGrow:1,justifyContent:'center',paddingBottom:'20px'}}>
                    <img src={Image} height={'200px'} alt=''/>
                </div>
                <div style={{display:'flex',flexDirection:'row',flexGrow:1,justifyContent:'center',paddingBottom:'20px',fontFamily:'monospace'}}>
                    <h3>Find A Professor</h3>
                </div>
                <Autocomplete
                    disablePortal
                    size={"large"}
                    options={professorList}
                    sx={{ width: '25vw' ,minWidth:'300px' }}
                    onChange={( _ , value ) => {navigate('/professor/'+value.id)}}
                    renderInput={(params) => <TextField {...params} variant='outlined' value={1}  onChange={(e)=>{search_professor(e.target.value)}}  label="Professor Name" />}
                /> 
                </div>
            </div>
          </>
}
export default FAPPage;