import React from 'react';
import LSUDashboard from './LSUDashboard';
import PageTitle from './components/PageTitle';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <PageTitle 
        title="Livestock Monitoring Admin" 
        subtitle="Manage and monitor your livestock operations efficiently"
      />
      <div className="flex-1">
        <LSUDashboard />
      </div>
    </div>
  );
};

export default App;