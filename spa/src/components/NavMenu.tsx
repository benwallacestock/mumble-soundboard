import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import BarsSolid from '../styling/icons/bars-solid.svg';
import TimesSolid from '../styling/icons/times-solid.svg';
import { frostPrimary, polarDark, snow } from '../styling/colours';
import { NavLink } from 'react-router-dom';
import { heading2FontSize } from '../styling/fonts';
import { spacing10, spacing6, spacing7 } from '../styling/spacing';
import { AuthenticationContext } from './authentication/context/AuthenticationContext';

export type NavMenuProps = {
  isAuthenticated: boolean;
  isDisabled: boolean;
  isAdmin: boolean;
};

export const NavMenu = ({
  isAuthenticated,
  isDisabled,
  isAdmin,
}: NavMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { logout } = useContext(AuthenticationContext);
  return (
    <NavMenuContainer>
      <TopBar>
        <h2>Mumble Soundboard</h2>
        <MenuIcon onClick={() => setOpen(true)} />
      </TopBar>
      <FullscreenNav open={open}>
        <CloseIcon onClick={() => setOpen(false)} />
        {isAuthenticated ? (
          <>
            {!isDisabled && (
              <>
                {' '}
                <NavBarLinkItem exact to='/' onClick={() => setOpen(false)}>
                  Home
                </NavBarLinkItem>
                <NavBarLinkItem
                  exact
                  to='/sounds'
                  onClick={() => setOpen(false)}
                >
                  Sounds
                </NavBarLinkItem>
                <NavBarLinkItem
                  exact
                  to='/upload'
                  onClick={() => setOpen(false)}
                >
                  Upload Sound
                </NavBarLinkItem>
                <NavBarLinkItem exact to='/user' onClick={() => setOpen(false)}>
                  Manage User
                </NavBarLinkItem>
                {isAdmin && (
                  <NavBarLinkItem
                    exact
                    to='/admin'
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </NavBarLinkItem>
                )}
              </>
            )}

            <NavBarItem
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Logout
            </NavBarItem>
          </>
        ) : (
          <>
            <NavBarLinkItem exact to='/login' onClick={() => setOpen(false)}>
              Login
            </NavBarLinkItem>
            <NavBarLinkItem exact to='/signup' onClick={() => setOpen(false)}>
              Sign Up
            </NavBarLinkItem>
          </>
        )}
      </FullscreenNav>
    </NavMenuContainer>
  );
};

const NavMenuContainer = styled.div`
  width: 100%;
`;
const MenuIcon = styled(BarsSolid)`
  height: 40px;
  width: 40px;

  &:hover {
    color: ${frostPrimary};
    cursor: pointer;
  }
`;

const CloseIcon = styled(TimesSolid)`
  height: 40px;
  width: 40px;

  margin-top: ${spacing10};
  margin-bottom: ${spacing7};

  &:hover {
    color: ${frostPrimary};
    cursor: pointer;
  }
`;

const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleText = styled.h2`
  margin: 0;
`;

const NavBarItem = styled.div`
  font-size: ${heading2FontSize};
  font-weight: bold;
  color: ${snow};
  text-decoration: none;
  cursor: pointer;

  &.active,
  &:hover {
    color: ${frostPrimary};
  }
`;

const NavBarLinkItem = styled(NavLink)`
  font-size: ${heading2FontSize};
  font-weight: bold;
  color: ${snow};
  text-decoration: none;

  &.active,
  &:hover {
    color: ${frostPrimary};
  }
`;

const FullscreenNav = styled.div<{ open: boolean }>`
  height: ${(props) => (props.open ? '100%' : '0%')};
  width: 100%;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  background-color: ${polarDark + 'FA'};
  overflow-x: hidden;
  transition: 0.25s;

  display: flex;
  align-items: center;
  flex-direction: column;

  ${NavBarItem}, ${NavBarLinkItem} {
    margin-bottom: ${spacing6};
  }
`;
