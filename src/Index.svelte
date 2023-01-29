<script>
    import Header from './lib/Header.svelte'
    import Footer from './lib/Footer.svelte'
    import { rtlSwitch } from "./js/helper/rtl-switch.js";
    rtlSwitch();
</script>

<Header />

<main>
    <div class="container">
        <h1 class="display-5 border-bottom pb-2">Home</h1>

        <p>
            Diese Seite wurde mit Svelte entwickelt und stellt eine Prüfungsleistung des Moduls IPWA01-01 der IU dar.
        </p>
    </div>
</main>

<Footer />

