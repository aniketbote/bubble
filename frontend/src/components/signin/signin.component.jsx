import {Form,Button} from 'react-bootstrap'
import { useState,useContext } from 'react';
import { AccountContext } from '../../Account/Account.context';
import './signin.style.css';

const SignIn = () =>{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const {authenticate,setUserStatus} = useContext(AccountContext)
    const onsubmit = (e)=>{
        e.preventDefault()
            authenticate(email,password).then(data =>
                {
                    setUserStatus(true)
                    setErrorMessage('');
                })
                .catch(err => {
                    if(err.name==='UserNotConfirmedException')
                    {
                       setErrorMessage('Verify your email and then sign in.')     
                    }
                    else if(err.name==='InvalidParameterException')
                    {
                        setErrorMessage('Incorrect username or password.');
                    }
                    else
                    {
                        console.log(err)
                        setErrorMessage(err.message);
                    }
                })
        };
   
    return(
    <>
        <h3 className='heading-signin'>Sign in</h3><hr style={{borderTop:'1px solid black'}}/>
        <Form onSubmit={onsubmit}>
            <Form.Group className="mb-3 input-groups" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else. 
                </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3 input-groups" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={e =>setPassword(e.target.value)} type="password" placeholder="Password" />
            </Form.Group>

            <Button className='button-signin' variant="primary" type="submit">
                Sign in
            </Button>
        </Form>
        {errorMessage ? <div ><p  className='error display-linebreak'>{errorMessage}</p></div>:null}
    </>
)}
export default SignIn;