import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../Account/Account.context";

const AccountPage = ()=>{
    const {session} = useContext(AccountContext);
    const user_id = session.idToken.payload.sub;
    console.log(user_id)
    const username = session.idToken.payload.preferred_username;
    const [data,setData]= useState({})
    useEffect(()=>{
        fetch('https://****cs78h5.execute-api.us-east-1.amazonaws.com/v1/get_user',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
                },
            body: JSON.stringify({user_id:user_id})
            })
            .then(response => response.json())
            .then(data => {console.log(data); setData(data)})
    },[])
    return <div>
        <div style={{padding:'20px'}}>
            <h2>Hello {username},</h2>
            <h3 style={{}}>manage account</h3>
        </div>
    </div>
}
export default AccountPage;