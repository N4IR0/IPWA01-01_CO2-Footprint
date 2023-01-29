import {readable} from 'svelte/store';

const apiUrl = "/emission_data.json";

const getData = async () => {
    const response = await fetch(apiUrl);
    return await response.json();
}

export const emissionDataStore = readable([], set => {
    getData().then(set);

    return () => {}
});