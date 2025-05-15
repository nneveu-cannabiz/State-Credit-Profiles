import React, { useState } from 'react';
import Layout from './ui/Layout';
import StateSelector from './components/State Selector/StateSelector';
import StateCreditHealthRatingIndicator from './components/State Credit Health Rating/StateCreditHealthRatingIndicator';
import StateARBreakdown from './components/AR Breakdown/StateARBreakdown';

function App() {
  const [selectedState, setSelectedState] = useState('California');

  return (
    <Layout>
      <StateSelector value={selectedState} onChange={setSelectedState} />
      <StateCreditHealthRatingIndicator />
      <StateARBreakdown selectedState={selectedState} />
    </Layout>
  );
}

export default App;