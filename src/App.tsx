import React from 'react';
import PageTitle from './components/PageTitle';
import MainPage from './components/MainPage';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <PageTitle 
        title="Livestock Monitoring Admin" 
        subtitle="Manage and monitor your livestock operations efficiently"
      />
      <div className="flex-1">
        <MainPage />
      </div>
    </div>
  );
};

export default App;