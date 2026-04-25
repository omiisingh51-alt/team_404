import React from 'react';
import CameraView from '../components/features/CameraView';

const DetectionPage = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <CameraView />
      </div>
    </div>
  );
};

export default DetectionPage;
