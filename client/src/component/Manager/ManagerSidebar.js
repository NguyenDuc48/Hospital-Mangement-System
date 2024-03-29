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
            Manager
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            {/* <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink> */}
            <NavLink exact to="/manager/doctor_account" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Doctors</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/manager/nurse_account" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Nurses</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/manager/drug" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Drugs</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/manager/equipment" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Equipments</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/manager/department" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Departments</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/manager/resetpass" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Reset Password</CDBSidebarMenuItem>
            </NavLink>

            {/* <NavLink
              exact
              to="/hero404"
              target="_blank"
              activeClassName="activeClicked" */}
            {/* >
              <CDBSidebarMenuItem icon="exclamation-circle">
                404 page
              </CDBSidebarMenuItem>
            </NavLink> */}
          </CDBSidebarMenu>
        </CDBSidebarContent>

      </CDBSidebar>
    </div>
  );
};

export default Sidebar;

