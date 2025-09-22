### <b>THERE ARE NEXT REQUIREMENTS FOR DEVELOPMENT WORKFLOW</b>

### Prepare for running app local

* Open a project in code redactor or web IDE<br />
* Open console<br />
* Run next npm commands<br />

`npm install` - install npm packages<br />
`npm run dev` - creates a local UI build

## React Component code styleguide

### Component structure

    import React, { useEffect, useState, useMemo, useCallback } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import lib from 'lib';
    
    import { fetchData } from '..store/fetchData'
    import { selectList } from '..store/selectors'
    import hooks from './hooks';
    import utils from './utils';
    import helper from './helper';
    import config from './config';
    import types from './types'
    import constants from './constants';

    import Component from './Component';
    import Button from 'common/Button'

    import styles from './Style.module.scss';

    const MyComponent = { list } => {
        const [editMode, setEditMode] = useState(false);
        const [values, setValues] = useState([]);

        const dispatch = useDispatch();
        const list = useSelector(selectList)

        const valuesIds = useMemo(() => values.map(value => value.id), [values]);

        ...hooks, ...localStorage, ...constants;

        const getData = useCallback(() => {}, []);
        
        const handleClick = () => {};
        
        const onMount = () => {
            dispatch(fetchData());
        };
        
        useEffect(() => {
            onMount();
        }, []);
        
        return (
            <div className={permissions.className}>
                <Component getData={getData} />
                <Button onClick={handleClick}>Click</Button>
            </div>
        );
    };

    export default MyComponent;

### Project folder/file structure

    components
        common
            Button
                index.js
                Button.js
            EmailModalForm
            ...
        Projects
            Projects.js
            index.js
                Item
                    index.js
                    Item.js
                    Item.module.scss
           