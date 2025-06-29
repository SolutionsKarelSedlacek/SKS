import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Warning from './Warning';
import Map from './Map';
import reportWebVitals from './reportWebVitals';
// @ts-ignore
import {
// @ts-ignore
  BrowserRouter,
// @ts-ignore
  Switch,
// @ts-ignore
  Route,
// @ts-ignore
} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Application />);

function Application()
{
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <App />
          <Warning />
          <Map />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
