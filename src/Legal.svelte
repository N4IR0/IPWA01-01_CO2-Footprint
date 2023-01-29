<script>
    import Header from './lib/Header.svelte'
    import Footer from './lib/Footer.svelte'
    import { rtlSwitch } from "./js/helper/rtl-switch.js";
    rtlSwitch();
</script>

<Header />

<main>
    <div class="container">
        <h1 class="display-5 border-bottom pb-2">Rechtliche Hinweise</h1>

        <p>
            Hier würden rechtliche Hinweise stehen...
        </p>
    </div>
</main>

<Footer />

