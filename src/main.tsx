import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './index.css';
import App from './App.tsx';
import {setupStore} from './store/store';

const store = setupStore();

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
);
