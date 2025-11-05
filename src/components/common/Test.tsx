import {useState} from 'react';
import {MultiSelect, MultiSelectChangeEvent} from 'primereact/multiselect';

interface Day {
    name: string;
    field: string;
}

export default function Test() {
    const [selectedCities, setSelectedCities] = useState<Day | null>(null);
    const cities: Day[] = [
        {name: 'Monday-06-10', field: 'monday-06-10'},
        {name: 'Tuesday-07-10', field: 'tuesday-07-10'},
        {name: 'Wednesday-08-10', field: 'wednesday-08-10'},
        {name: 'Thursday-09-10', field: 'thursday-09-10'},
        {name: 'Friday-10-10', field: 'friday-10-10'},
        {name: 'Saturday-11-10', field: 'saturday-11-10'},
        {name: 'Sunday12-10', field: 'sunday12-10'},
        {name: 'Monday-13-10', field: 'monday-13-10'},
        {name: 'Tuesday-14-10', field: 'tuesday-14-10'},
        {name: 'Wednesday-15-10', field: 'wednesday-15-10'},
        {name: 'Thursday-16-10', field: 'thursday-16-10'},
        {name: 'Friday-17-10', field: 'friday-17-10'},
        {name: 'Saturday-18-10', field: 'saturday-11-10'},
        {name: 'Sunday-19-10', field: 'sunday-19-10'},
    ];

    return (
        <div className="card flex justify-content-center">
            <MultiSelect
                value={selectedCities}
                onChange={(e: MultiSelectChangeEvent) => setSelectedCities(e.value)}
                options={cities}
                optionLabel="name"
                placeholder="Select Day"
                maxSelectedLabels={3}
                className="w-full md:w-20rem"
            />
        </div>
    );
}
