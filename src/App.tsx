import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes/routes';

import { useEffect } from 'react';
// import DefaultLayout from './components/Layouts/DefaultLayout';

function App() {
  useEffect(() => {
    document.title = 'Trello';
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  // <DefaultLayout>
                  <Page />
                  // </DefaultLayout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
