import { useState } from 'react'
import './App.css'
import { Button, P1 } from './components'
import * as timeUtils from './utils/time'
import { AboutPage } from './pages'
import MisteriousComponentDefaulty from './components/image/image'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <P1>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </P1>
        </div>
        <Button
          type="button"
          className="counter"
          onClick={() => {
            console.log(timeUtils.formatDay())
            setCount((count) => count + 1)
          }}
        >
          Count is {count}
        </Button>
        <MisteriousComponentDefaulty>
          <img />
        </MisteriousComponentDefaulty>
      </section>

      <div className="ticks">
        <AboutPage />
      </div>



      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
