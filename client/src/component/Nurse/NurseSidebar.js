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
            Nurse
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/nurse/get_profile" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Profile</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/nurse/patient_list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Patient List</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/nurse/booking_list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Booking List</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/nurse/wait_list" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Waiting List</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/nurse/get_equipment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Equipment List</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/nurse/get_drugs" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Drugs List</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

      </CDBSidebar>
    </div>
  );
};

export default Sidebar;

