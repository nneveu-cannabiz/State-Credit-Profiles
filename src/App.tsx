import React, { useState } from 'react';
import Layout from './ui/Layout';
import StateHeader from './components/State Selector/StateHeader';
import StateCreditHealthRatingIndicator from './components/State Credit Health Rating/StateCreditHealthRatingIndicator';
import StateOverview from './components/State Overview/StateOverview';
import BreakdownTabs from './components/Breakdown/BreakdownTabs';
import { TimelineFilter } from './components/Timeline/TimelineFilter';

function App() {
  const [selectedState, setSelectedState] = useState('California');
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineFilter>('Q1 2025 (Jan-Mar)');

  return (
    <Layout>
      <StateHeader 
        selectedState={selectedState} 
        onStateChange={setSelectedState} 
        selectedTimeline={selectedTimeline}
        onTimelineChange={setSelectedTimeline}
      />
      <StateCreditHealthRatingIndicator />
      <StateOverview selectedState={selectedState} />
      <BreakdownTabs 
        selectedState={selectedState} 
        selectedTimeline={selectedTimeline} 
      />
    </Layout>
  );
}

export default App;