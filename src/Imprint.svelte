<script>
    import Header from './lib/Header.svelte'
    import Footer from './lib/Footer.svelte'
    import { rtlSwitch } from "./js/helper/rtl-switch.js";
    rtlSwitch();
</script>

<Header />

<main>
    <div class="container">
        <h1 class="display-5 border-bottom pb-2">Impressum</h1>

        <p>
            Hier würde ein Impressum stehen...
        </p>
    </div>
</main>

<Footer />

