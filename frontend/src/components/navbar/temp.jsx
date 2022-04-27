
import { Nav, Navbar  } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { AccountContext } from '../../Account/Account.context';
import { useContext } from 'react';
import './navbar.style.css';
const NavBar = () => {
const {userStatus,logout} = useContext(AccountContext)
return (
    <Navbar style={{padding:"0.2em",position:'fixed',top:0 ,zIndex:2,width:'100%'}} bg="dark" variant='dark' expand="lg">
        
            <Navbar.Brand style={{font: '20px Bebas Neue cursive' }} >Bubble</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <span className='hiddenButtons'>
                <Nav className="me-auto my-2 my-lg-0" >
                    <Nav.Link  style={{fontSize: "80%" }} as={Link} to="/"> Home </Nav.Link>
                </Nav>
                <Nav className="me-auto my-2 my-lg-0" >
                    <Nav.Link  style={{fontSize: "80%" }} as={Link} to="/"> Questions </Nav.Link>
                </Nav>
                <Nav className="me-auto my-2 my-lg-0" >
                    <Nav.Link  style={{fontSize: "80%" }} as={Link} to="/"> Blogs </Nav.Link>
                </Nav>
                <Nav className="me-auto my-2 my-lg-0" >
                    <Nav.Link  style={{fontSize: "80%" }} as={Link} to="/"> Find A Professor </Nav.Link>
                </Nav>
            </span>
            <Nav className="ms-auto my-2 my-lg-0" >
            {!userStatus?<Nav.Link style={{fontSize: "80%" }}  as={Link} to="/login"> Sign in </Nav.Link>:
            <Nav.Link style={{fontSize: "80%" }}  as={Link} to="#" onClick={e=> {e.preventDefault();logout()}}>Sign Out</Nav.Link>}
            </Nav>
            </Navbar.Collapse>
        
    </Navbar>

)
}
export default NavBar;