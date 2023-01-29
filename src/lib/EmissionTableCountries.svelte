<script>
  import {writable} from 'svelte/store';
  import { emissionDataStore } from "../js/stores/emission-data-store.js";
  import {tableStoreFormat, applyTableSettings, prepareFormDataForStore} from "../js/helper/table-setting.js";
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
    const aggregatedData = {};
    data.forEach(function (i) {
      aggregatedData[i.country] = {
        country: i.country,
        emission: ((aggregatedData[i.country]||{}).emission || 0) + i.emission
      }
    });
    const minifiedData = Object.values(aggregatedData)
    tableSettingStore.update(tableSettingStore => ({...tableSettingStore, origData: minifiedData, viewData: minifiedData}));
  });
</script>

<h2>Nach Ländern <a class="text-muted" href="#collapseCountryFilter" data-bs-toggle="collapse"><Funnel /></a></h2>
<div class="collapse" id="collapseCountryFilter">
  <div class="card card-body">
    <form on:submit|preventDefault={filterTable}>
      <div class="row">
        <div class="col">
          <label for="countryTableFilterCountry" class="form-label">Land</label>
          <input type="text" class="form-control" id="countryTableFilterCountry" name="country">
        </div>
        <div class="col">
          <label for="countryTableFilterEmission" class="form-label">CO²-Emissionen</label>
          <div class="input-group" id="countryTableFilterEmission">
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
        <td>{entry.emission.toFixed(2)}</td>
      </tr>
      {/each}
  </tbody>
</table>
