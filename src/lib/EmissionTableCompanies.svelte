<script>
  import {writable} from 'svelte/store';
  import { emissionDataStore } from "../js/stores/emission-data-store.js";
  import { tableStoreFormat, applyTableSettings, prepareFormDataForStore } from "../js/helper/table-setting.js";
  import Sorting from "./Sorting.svelte";
  import Funnel from "svelte-bootstrap-icons/lib/Funnel.svelte";


  const tableSettingStore = writable({...tableStoreFormat});

  let viewData = [];

  function filterTable(e) {
    const data = prepareFormDataForStore(e.target);
    tableSettingStore.update(tableSettingStore => ({...tableSettingStore, filterData: data}));
  }

  function resetFilter() {
    tableSettingStore.update(tableSettingStore => ({...tableSettingStore, filterData: {}}));
  }

  tableSettingStore.subscribe(data => {
    applyTableSettings(data);
    viewData = data.viewData;
  });

  emissionDataStore.subscribe(data => {
    tableSettingStore.update(tableSettingStore => ({...tableSettingStore, origData: data, viewData: data}))
  });
</script>

<h2>Nach Firmen <a class="text-muted" href="#collapseCompanyFilter" data-bs-toggle="collapse"><Funnel /></a></h2>
<div class="collapse" id="collapseCompanyFilter">
  <div class="card card-body">
    <form on:submit|preventDefault={filterTable}>
      <div class="row">
        <div class="col">
          <label for="companyTableFilterCountry" class="form-label">Land</label>
          <input type="text" class="form-control" id="companyTableFilterCountry" name="country">
        </div>
        <div class="col">
          <label for="companyTableFilterCompany" class="form-label">Firma</label>
          <input type="text" class="form-control" id="companyTableFilterCompany" name="company">
        </div>
        <div class="col">
          <label for="companyTableFilterEmission" class="form-label">CO²-Emissionen</label>
          <div class="input-group" id="companyTableFilterEmission">
            <input type="number" class="form-control" placeholder="Von" name="emission.from">
            <span class="input-group-text">-</span>
            <input type="number" class="form-control" placeholder="Bis" name="emission.to">
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
            <button class="btn btn-warning" type="reset" on:click={resetFilter}><Funnel /> Reset</button>
            <button class="btn btn-primary" type="submit"><Funnel /> Filtern</button>
        </div>
      </div>
    </form>
  </div>
</div>

<table class="table">
  <thead>
    <tr>
      <th>
        <Sorting
                tableSettingStore="{tableSettingStore}"
                columnName="Land"
                columnIdentifier="country"
        />
      </th>
      <th>
        <Sorting
                tableSettingStore="{tableSettingStore}"
                columnName="Firma"
                columnIdentifier="company"
        />
      </th>
      <th>
        <Sorting
                tableSettingStore="{tableSettingStore}"
                columnName="CO²-Emissionen"
                columnIdentifier="emission"
        />
      </th>
    </tr>
  </thead>
  <tbody>
    {#each viewData as entry}
      <tr>
        <td>{entry.country}</td>
        <td>{entry.company}</td>
        <td>{entry.emission}</td>
      </tr>
      {/each}
  </tbody>
</table>