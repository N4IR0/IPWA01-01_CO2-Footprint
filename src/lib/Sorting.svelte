<script>
    import CaretUp from "svelte-bootstrap-icons/lib/CaretUp.svelte";
    import CaretUpFill from "svelte-bootstrap-icons/lib/CaretUpFill.svelte";
    import CaretDown from "svelte-bootstrap-icons/lib/CaretDown.svelte";
    import CaretDownFill from "svelte-bootstrap-icons/lib/CaretDownFill.svelte";

    export let columnName;
    export let columnIdentifier;
    export let tableSettingStore;

    let tableStoreData = {};
    let currentSortDir = false;

    tableSettingStore.subscribe(data => {
        tableStoreData = data;

        if (data.sortColumn !== columnIdentifier) {
            currentSortDir = false;
            return;
        }

        currentSortDir = data.sortDir;
    })

    function setSortDir(dir) {
        tableStoreData.sortDir = dir;
        tableStoreData.sortColumn = columnIdentifier;
        tableSettingStore.set(tableStoreData);
    }

    function setAsc() {
        setSortDir('asc');
    }

    function setDesc() {
        setSortDir('desc');
    }

    function resetSorting() {
        tableStoreData.sortDir = null;
        tableStoreData.sortColumn = null;
        tableSettingStore.set(tableStoreData);
    }
</script>
<span class="d-flex align-items-center">
    {columnName}
    {#if currentSortDir === 'asc'}
        <button class="btn btn-outline-success ms-1" on:click|stopPropagation={resetSorting}>
            <CaretUpFill />
        </button>
        <button class="btn btn-outline-warning ms-1" on:click|stopPropagation={setDesc}>
            <CaretDown />
        </button>
    {:else if currentSortDir === 'desc' }
        <button class="btn btn-outline-warning ms-1" on:click|stopPropagation={setAsc}>
            <CaretUp />
        </button>
        <button class="btn btn-outline-success ms-1" on:click|stopPropagation={resetSorting}>
            <CaretDownFill />
        </button>
    {:else }
        <button class="btn btn-outline-warning ms-1" on:click|stopPropagation={setAsc}>
            <CaretUp />
        </button>
        <button class="btn btn-outline-warning ms-1" on:click|stopPropagation={setDesc}>
            <CaretDown />
        </button>
    {/if}
</span>