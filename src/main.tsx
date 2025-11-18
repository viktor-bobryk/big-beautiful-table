import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css';

import {PrimeReactProvider} from 'primereact/api';
import App from './App.tsx';
import {setupStore} from './store/store';

const store = setupStore();

createRoot(document.getElementById('root')!).render(
    <PrimeReactProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </PrimeReactProvider>,
);
