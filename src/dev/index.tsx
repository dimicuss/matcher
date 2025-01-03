import {createRoot} from 'react-dom/client'
import {App} from './src/ui/app'

const domRoot = document.querySelector('#root')

if (domRoot) {
  const root = createRoot(domRoot)

  root.render(<App />)
}
