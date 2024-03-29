import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div
      style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: 'inherit' }}
          >
            Patient
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/patient/get_profile" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Profile</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/patient/get_history" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">History</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/patient/make_appointment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Make Appointment</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

      </CDBSidebar>
    </div>
  );
};

export default Sidebar;

