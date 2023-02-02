export const tableStoreFormat = {
    origData: [],
    viewData: [],
    sortColumn: null,
    sortDir: null,
    filterData: {}
};

function sortData(data) {
    if (data.sortColumn !== null && data.sortDir !== null) {
        let sortColumn = data.sortColumn;
        let sortDir = data.sortDir;

        if (sortDir === 'asc') {
            data.viewData.sort((a,b) => (a[sortColumn] > b[sortColumn]) ? 1 : -1);
        } else if (sortDir === 'desc') {
            data.viewData.sort((a,b) => (a[sortColumn] > b[sortColumn]) ? -1 : 1);
        }
    }
}

function filterData(data) {
    if (data.viewData.length === 0) {
        return;
    }

    Object.keys(data.filterData).forEach((prop) => {
        let filterFunction;

        if (!data.filterData[prop]) {
            return;
        }

        if (typeof data.filterData[prop] === 'object') {
            if (!data.filterData[prop].from && !data.filterData[prop].to) {
                return;
            }

            filterFunction = function(entry) {
                if (data.filterData[prop].from && data.filterData[prop].to) {
                    return entry[prop] >= data.filterData[prop].from && entry[prop] <= data.filterData[prop].to;
                } else if (data.filterData[prop].from) {
                    return entry[prop] >= data.filterData[prop].from;
                } else if (data.filterData[prop].to) {
                    return entry[prop] <= data.filterData[prop].to;
                }
            }
        } else {
            filterFunction = function(entry) {
                return entry[prop].toLowerCase().includes(data.filterData[prop].toLowerCase())
            }
        }
        data.viewData = data.viewData.filter(filterFunction);
    });
}

export function emissionFieldValidator() {
    return (value) => ({
        valid: value === '' || value === null || value >= 0,
        name: 'emission_validator'
    })
}

export function applyTableSettings(data) {
    data.viewData = [...data.origData];
    sortData(data);
    filterData(data);
}