import React from 'react';
import ReactDOM from 'react-dom/client';
import { createOvermind } from 'overmind';
import { Provider } from 'overmind-react';
import { config } from './overmind';
import App from './App';
// import reportWebVitals from './reportWebVitals';

const overmind = createOvermind(config);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider value={overmind}>
        <App />
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
