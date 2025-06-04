import React from 'react';
import StateSelector from './StateSelector';
import TimelineFilter from '../Timeline/TimelineFilter';
import { TimelineFilter as TimelineFilterType } from '../Timeline/TimelineFilter';

interface StateHeaderProps {
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedTimeline: TimelineFilterType;
  onTimelineChange: (timeline: TimelineFilterType) => void;
}

const StateHeader: React.FC<StateHeaderProps> = ({
  selectedState,
  onStateChange,
  selectedTimeline,
  onTimelineChange
}) => {
  return (
    <div className="flex justify-center items-center p-6 border-b border-primary-light bg-primary-lighter/30 relative">
      <div className="container max-w-5xl mx-auto flex justify-center items-center">
        <StateSelector value={selectedState} onChange={onStateChange} />
        <div className="absolute right-8">
          <TimelineFilter value={selectedTimeline} onChange={onTimelineChange} />
        </div>
      </div>
    </div>
  );
};

export default StateHeader;