import '../../scss/app.scss'
import * as bootstrap from 'bootstrap'

import App from '../../Index.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
