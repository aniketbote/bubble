import './loginSignup.style.css';
import SignIn from '../../components/signin/signin.component';
import SignUp from '../../components/signup/signup.component';
import { useState } from 'react';
import {Link} from 'react-router-dom';
// import { Toast } from 'react-bootstrap';


const LoginSignupPage = () => {

    const [viewLogin,setViewLogin] = useState(true);
    
    const onLinkClick = (e) =>{
        e.preventDefault();
        setViewLogin(!viewLogin) 
    }

    
    return (
            <div id="container">
                <div className="box" id="bluebox">
                        {viewLogin ? <SignIn/> : <SignUp setViewLogin={setViewLogin} />}
                </div>
                <Link className='bottom-link' to="#" onClick={onLinkClick}>{viewLogin ? <>Don't have an account?</> : <>Already have an account?</> }</Link>
            </div> )};

export default LoginSignupPage;