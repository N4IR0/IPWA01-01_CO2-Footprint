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

    Object.keys(data.viewData[0]).forEach(function(prop) {
        if (data.filterData[prop] === undefined) {
            return;
        }
        let value = data.filterData[prop];
        data.viewData = data.viewData.filter(function (entry) {
            if (typeof value === 'object') {
                if (value.from !== undefined && !Number.isNaN(value.from) && value.to !== undefined && !Number.isNaN(value.to)) {
                    return entry[prop] >= value.from && entry[prop] <= value.to;
                } else if (value.from !== undefined && !Number.isNaN(value.from)) {
                    return entry[prop] >= value.from;
                } else if (value.to !== undefined && !Number.isNaN(value.to)) {
                    return entry[prop] <= value.to;
                }
            } else {
                return entry[prop].toLowerCase().includes(value.toLowerCase())
            }
        });
    });
}

export function prepareFormDataForStore(form) {
    const formData = new FormData(form);

    const data = {};
    for (let field of formData) {
        const [key, value] = field;

        if (value === "") {
            continue;
        }

        if (key.includes('.')) {
            const splittedKeys = key.split('.', 2)
            if (data[splittedKeys[0]] === undefined) {
                data[splittedKeys[0]] = {};
            }
            data[splittedKeys[0]][splittedKeys[1]] = value;
        } else {
            data[key]  = value;
        }
    }

    return data;
}

export function applyTableSettings(data) {
    data.viewData = [...data.origData];
    sortData(data);
    filterData(data);
}