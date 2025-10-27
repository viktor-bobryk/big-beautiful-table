import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';

import DataTable from './components/DataTable';

function App() {
    return (
        <>
            <h1>Big Beautiful Table</h1>
            <DataTable />
        </>
    );
}

export default App;
