import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-grid';
import Topbar from '../components/topbar';
import StreamList from '../components/dashboard/StreamList';
import TitleBar from '../components/titlebar';

const Dashboard = () => {
  const firstName = localStorage.getItem('first_name');
  return (
    <React.Fragment>
      <Helmet>
        <title>User Dashboard</title>
      </Helmet>
      <Topbar />
      <div className="page-container">
        <TitleBar
          title={`Hello ${firstName}!`}
        />
        <Container>
          <h3>Technical</h3>
          <StreamList type="T" hasParent={false} />
          <h3>Non-Technical</h3>
          <StreamList type="N" hasParent={false} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
