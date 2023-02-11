<script>
  import {writable} from 'svelte/store';
  import { emissionDataStore } from "../js/stores/emission-data-store.js";
  import { tableStoreFormat, applyTableSettings, emissionFieldValidator } from "../js/helper/table-setting.js";
  import { form, field, combined, style } from 'svelte-forms';
  import { pattern } from 'svelte-forms/validators';
  import Sorting from "./Sorting.svelte";
  import Funnel from "svelte-bootstrap-icons/lib/Funnel.svelte";


  const tableSettingStore = writable({...tableStoreFormat});

  let viewData = [];

  const countryFilterField = field('country', '', [pattern(/^\w*$/)]);
  const companyFilterField = field('company', '', [pattern(/^\w*$/)]);
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
  const filterForm = form(countryFilterField, companyFilterField, emissionRangeFilterField);

  function filterTable() {
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
          <input type="text" id="companyTableFilterCountry" class="form-control" bind:value={$countryFilterField.value} use:style={{field: countryFilterField, invalid: 'is-invalid'}}/>
          {#if $countryFilterField.invalid}
            <div class="invalid-feedback">
              Darf nur Buchstaben, Zahlen und Unterstriche enthalten!
            </div>
          {/if}
        </div>
        <div class="col">
          <label for="companyTableFilterCompany" class="form-label">Firma</label>
          <input type="text" id="companyTableFilterCompany" class="form-control" bind:value={$companyFilterField.value} use:style={{field: companyFilterField, invalid: 'is-invalid'}} />
          {#if $companyFilterField.invalid}
            <div class="invalid-feedback">
              Darf nur Buchstaben, Zahlen und Unterstriche enthalten!
            </div>
          {/if}
        </div>
        <div class="col">
          <label for="companyTableFilterEmission" class="form-label">CO₂-Emissionen</label>
          <div class="input-group" id="companyTableFilterEmission">
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
            <button class="btn btn-primary" id="companyTableFilterSubmit" type="submit" disabled="{!$filterForm.valid}"><Funnel /> Filtern</button>
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
        <td>{entry.company}</td>
        <td>{entry.emission}</td>
      </tr>
      {/each}
  </tbody>
</table>