<script>
    import Header from './lib/Header.svelte'
    import Footer from './lib/Footer.svelte'
    import EmissionTableCompanies from "./lib/EmissionTableCompanies.svelte";
    import EmissionTableCountries from './lib/EmissionTableCountries.svelte';
    import CaretRight from "svelte-bootstrap-icons/lib/CaretRight.svelte";
    import CaretLeft from "svelte-bootstrap-icons/lib/CaretLeft.svelte";
    import { pageSettingStore } from './js/stores/page-setting-store.js';
    import { rtlSwitch } from "./js/helper/rtl-switch.js";
    rtlSwitch();

    let rtlLayout = false;
    pageSettingStore.subscribe((data) => {
        rtlLayout = data.rtl;
    })
</script>

<Header />

<main class="container-fluid">
    <div class="row">
        <div class="col-md-3 col-lg-2">
            <div class="sticky-sidebar sticky-top ms-2">
                <h4 class="text-muted pb-3">Seiteninhalt</h4>
                <nav class="navbar">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link d-flex align-items-center" href="#countries">
                                {#if rtlLayout}
                                    <CaretLeft width={32} heigth={32} />
                                    Nach Ländern
                                {:else}
                                    <CaretRight width={32} heigth={32} />
                                    Nach Ländern
                                {/if}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link d-flex align-items-center" href="#companies">
                                {#if rtlLayout}
                                    <CaretLeft width={32} heigth={32} />
                                    Nach Firmen
                                {:else}
                                    <CaretRight width={32} heigth={32} />
                                    Nach Firmen
                                {/if}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="col-md-9 col-lg-10">
            <h1 class="display-5 border-bottom pb-2">CO²-Emissionen</h1>
            <p>
                Auf dieser Seite finden Sie die CO²-Emissionswerte verschiedener Firmen und Länder. Die Werte und Firmen sind dabei fiktive Datensätze.
            </p>
            <section id="countries">
                <EmissionTableCountries />
            </section>
            <section id="companies">
                <EmissionTableCompanies />
            </section>
        </div>
    </div>
</main>

<Footer />