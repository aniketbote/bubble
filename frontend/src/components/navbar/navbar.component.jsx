import { AccountContext } from '../../Account/Account.context';
import { useContext } from 'react';

import './navbar.style.css';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ArticleIcon from '@mui/icons-material/Article';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HomeIcon from '@mui/icons-material/Home';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';

export default function NavBar() {

  const {userStatus,logout} = useContext(AccountContext)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <IconButton color="inherit">
            <AccountCircle fontSize="large" />
        </IconButton>
        <p className="menu-text">Profile</p></MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <IconButton color="inherit">
            <ManageAccountsIcon fontSize="large" />
        </IconButton>
        <p className="menu-text">My account</p></MenuItem>
        
        <span className='hiddenButtons'>
        <MenuItem onClick={()=>{logout();handleMenuClose()}}>
            <IconButton color="inherit">
                <MeetingRoomIcon fontSize="large" />
            </IconButton>
            <p className="menu-text">Sign out</p>
        </MenuItem>
        </span>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton  color="inherit">
            <HomeIcon fontSize="large" />
        </IconButton>
        <p className="menu-text">Home</p>
      </MenuItem>    
      <MenuItem>
        <IconButton  color="inherit">
            <QuestionMarkIcon fontSize="large" />
        </IconButton>
        <p className="menu-text">Questions</p>
      </MenuItem>
      <MenuItem>
        <IconButton  color="inherit">
            <ArticleIcon fontSize="large" />
        </IconButton>
        <p className="menu-text">Blogs</p>
      </MenuItem>
      <MenuItem>
        <IconButton  color="inherit">
            <PersonSearchRoundedIcon fontSize="large" />
        </IconButton>
        <p className="menu-text">Find A Professor</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle fontSize="large" />
        </IconButton>
        <p className="menu-text">Profile</p>
      </MenuItem>
      <MenuItem onClick={()=>{logout();handleMenuClose()}}>
        <IconButton color="inherit">
            <MeetingRoomIcon fontSize="large" />
        </IconButton>
         <p className="menu-text">Sign out</p>
      </MenuItem>
    </Menu>
  );

  window.addEventListener('resize', handleMenuClose);
  
  return (
    <Box style={{zIndex:5}} sx={{ flexGrow: 1 }}>
      <AppBar className='app-bar' position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            style={{font: '20px Bebas Neue cursive' }}
          >
            Bubble
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          {userStatus?
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle fontSize="large"/>
            </IconButton>
          </Box>:null}
          {userStatus?<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon fontSize="large"/>
            </IconButton>
          </Box>:null}
        </Toolbar>
      </AppBar>
      {userStatus?renderMobileMenu:null}
      {userStatus?renderMenu:null}
    </Box>
  );
}