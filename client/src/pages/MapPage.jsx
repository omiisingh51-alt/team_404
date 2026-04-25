import React from 'react';
import { useTranslation } from 'react-i18next';
import MapView from '../components/features/MapView';

const MapPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
};

export default MapPage;
