<script>
  import {writable} from 'svelte/store';
  import { emissionDataStore } from "../js/stores/emission-data-store.js";
  import {
    tableStoreFormat,
    applyTableSettings,
    emissionFieldValidator
  } from "../js/helper/table-setting.js";
  import { form, field, combined, style } from 'svelte-forms';
  import { pattern } from 'svelte-forms/validators';
  import Sorting from "./Sorting.svelte";
  import Funnel from "svelte-bootstrap-icons/lib/Funnel.svelte";

  const tableSettingStore = writable({...tableStoreFormat});

  let viewData = [];

  const countryFilterField = field('country', '', [pattern(/^\w*$/)]);
  const emissionFromFilterField = field('from', '', [emissionFieldValidator()]);
  const emissionToFilterField = field('to', '', [emissionFieldValidator()]);
  const emissionRangeFilterField = combined(
          'emission',
          [emissionFromFilterField, emissionToFilterField],
          ([emissionFromFilterField, emissionToFilterField]) => {
            return {
              from: emissionFromFilterField.value,
              to: emissionToFilterField.value
            }
          }
  );
  const filterForm = form(countryFilterField, emissionRangeFilterField);

  function filterTable(e) {
    if ($filterForm.valid) {
      tableSettingStore.update(tableSettingStore => ({...tableSettingStore, filterData: $filterForm.summary}));
    }
  }

  function resetFilter() {
    filterForm.reset();
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
          <input type="text" id="countryTableFilterCountry" class="form-control" bind:value={$countryFilterField.value} use:style={{field: countryFilterField, invalid: 'is-invalid'}}/>
          {#if $countryFilterField.invalid}
            <div class="invalid-feedback">
              Darf nur Buchstaben, Zahlen und Unterstriche enthalten!
            </div>
          {/if}
        </div>
        <div class="col">
          <label for="countryTableFilterEmission" class="form-label">CO₂-Emissionen</label>
          <div class="input-group" id="countryTableFilterEmission">
            <input type="number" class="form-control" placeholder="Von" step="0.01" bind:value={$emissionFromFilterField.value} use:style={{field: emissionFromFilterField, invalid: 'is-invalid'}} />
            <span class="input-group-text">-</span>
            <input type="number" class="form-control" placeholder="Bis" step="0.01" bind:value={$emissionToFilterField.value} use:style={{field: emissionToFilterField, invalid: 'is-invalid'}} />
            {#if $emissionFromFilterField.invalid || $emissionToFilterField.invalid}
              <div class="invalid-feedback">
                Darf nur positive Zahlen enthalten!
              </div>
            {/if}
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col">
          <button class="btn btn-warning" type="reset" on:click={resetFilter}><Funnel /> Reset</button>
          <button class="btn btn-primary" id="countryTableFilterSubmit" type="submit" disabled="{!$filterForm.valid}"><Funnel /> Filtern</button>
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
                columnName="CO₂-Emissionen"
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
