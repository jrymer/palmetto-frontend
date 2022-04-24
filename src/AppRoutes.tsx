import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ROUTES from './routes';
import HomeView from './views/home';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomeView />} />
    </Routes>
  );
};

export default AppRoutes;
