import {Form,Button} from 'react-bootstrap'
import { useState,useEffect } from 'react';
import {CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../../UserPool/UserPool';
import './signup.style.css';




const SignUp = (props) =>{
    const [userName,setUserName]= useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const [errorUsernameMessage,setErrorUsernameMessage] = useState('');
    const [errorEmailMessage,setErrorEmailMessage] = useState('');
    const [errorPasswordMessage,setErrorPasswordMessage] = useState('');
    const [errorConfirmPasswordMessage,setErrorConfirmPasswordMessage] = useState('');
    const [passMatch,setPassMatch] = useState(false);
    const [errorUsername,setErrorUsername] = useState(true);
    const [errorEmail,setErrorEmail] = useState(true);
    const [errorPassword,setErrorPassword] = useState(true);


    useEffect(()=>{
        if(password !== confirmPassword)
        {
            setErrorConfirmPasswordMessage('Password doesn\'t match.')
            setPassMatch(false)
        }
        else
        {
            setErrorConfirmPasswordMessage('')
            setPassMatch(true)
        }
    },[confirmPassword,password])

    const onUsernameChange = (e)=>{
        setUserName(e.target.value)
        const regularExpression = new RegExp("^[A-Za-z][A-Za-z0-9_ ]{7,20}$");
        if(regularExpression.test(e.target.value))
        {
            setErrorUsernameMessage('');
            setErrorUsername(false);
        }
        else
        {
            const message =`Username must be 8 to 30 characters long, can't start with number and can't contain special character.`
            setErrorUsernameMessage(message);
            setErrorUsername(true);
        } 
    
    }

    const onEmailChange = (e)=>{
        setEmail(e.target.value)
        const regularExpression = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
        if(regularExpression.test(e.target.value))
        {
            setErrorEmailMessage('');
            setErrorEmail(false);
        }
        else
        {
            const message =`Please enter a valid email address.`
            setErrorEmailMessage(message);
            setErrorEmail(true);
        } 
    
    }

    const onPasswordChange = (e)=>{
        setPassword(e.target.value)
        const regularExpression = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-z0-9]{8,}");
        if (confirmPassword!=='' & confirmPassword!==e.target.value)
        {
            setErrorConfirmPasswordMessage('Password doesn\'t match.')
            setPassMatch(false)
        }
        else
        {
            setErrorConfirmPasswordMessage('')
            setPassMatch(true)
        }
        if(regularExpression.test(e.target.value))
        {
            setErrorPasswordMessage('');
            setErrorPassword(false);
        }
        else
        {
            const message =`Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number`
            setErrorPasswordMessage(message);
            setErrorPassword(true);
        } 
    
    }

    const onsubmit = (e) =>{
        e.preventDefault()
        if (!errorPassword & !errorEmail & !errorUsername & passMatch)
        {
            const attributes = [new CognitoUserAttribute({
                Name:'preferred_username',
                Value: userName
            })]
            UserPool.signUp(email,password,attributes,null, (err , {userSub})=>{
                if (err) {
                   setErrorMessage(err.message);
                }
                else {

                    const user_data = {
                                username: userName,
                                user_id: userSub,
                                email: email
                            }
                            console.log('user_data:',user_data);
                        fetch('https://mlzxcs78h5.execute-api.us-east-1.amazonaws.com/v1/signup',{
                            method:'POST', 
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin':'*'
                            },
                            body: JSON.stringify(user_data)
                            })
                            .then(response => response.json())
                            .then(data => { console.log(data); props.setViewLogin(true)})
                            .catch(err => console.log('error:',err));
                }
            })
        }
    }

    return(
    <>
        <h3 className='heading-signup'>Sign up</h3><hr style={{borderTop:'1px solid black'}} />
        <Form onSubmit={onsubmit}>
            <Form.Group className="mb-3 input-groups" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control   onChange={(e)=>onUsernameChange(e)} 
                                type="text" placeholder="Username" />
                
            </Form.Group>

            <Form.Group className="mb-3 input-groups" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control onChange={(e)=>onEmailChange(e)} 
                              type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-3 input-groups" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control   onChange={(e)=>onPasswordChange(e)} 
                                type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group className="mb-3 input-groups" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control   onChange={(e)=>setConfirmPassword(e.target.value)} 
                                type="password" placeholder="Confirm password" />
            </Form.Group>

            <Button className='button-signup' variant="primary" type="submit">
                Sign up
            </Button>
        </Form>
        {errorUsernameMessage ? <div ><p  className='error display-linebreak'>{errorUsernameMessage}</p></div>:null}
        {errorEmailMessage ? <div ><p  className='error display-linebreak'>{errorEmailMessage}</p></div>:null}
        {errorPasswordMessage ? <div ><p  className='error display-linebreak'>{errorPasswordMessage}</p></div>:null}
        {errorConfirmPasswordMessage ? <div ><p  className='error display-linebreak'>{errorConfirmPasswordMessage}</p></div>:null}
        {errorMessage ? <div ><p  className='error display-linebreak'>{errorMessage}</p></div>:null}
    </>
    
)}
export default SignUp;