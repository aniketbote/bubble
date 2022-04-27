import './answerPage.style.css';
import { useEffect, useState } from 'react';
import { Paper } from '@mui/material';

const AnswerPage = ()=>{
    const [data,setData] = useState({})
    useEffect(()=>{
        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/get_question',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
              },
            body: JSON.stringify({question_id:"fef9a837be654ed49ec8aa1b7cad7792"})
            })
            .then(response => response.json())
            .then(data => { setData(data)})
    },[])
    console.log(data)
    return (
        <div className='answerPageContainer'>
                <div className='content-column'>
                    
                </div>
                <div className='right-column'>  
                    <Paper elevation={8} style={{minHeight:'100%'}} >
                    </Paper>
                </div>
        </div>
        
    )
}
export default AnswerPage;