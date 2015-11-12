import React from 'react';
import AdminHome from '../admin/home';
import MainLayout from './main';

export default class AdminLayout extends MainLayout {
  getPageComponent() {
    switch (this.state.page) {
    default:
      return <AdminHome/>;
    };
  }
}
