import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Karldex from './Karldex';
import {
// @ts-ignore
  BrowserRouter,
// @ts-ignore
  Switch,
// @ts-ignore
  Route,
// @ts-ignore
  Routes,
// @ts-ignore
} from "react-router-dom";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Application />);

function Application()
{
  return (
    <BrowserRouter basename="/SKS/2025">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/karldex" element={<Karldex />} />
      </Routes>
    </BrowserRouter>
  );
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
