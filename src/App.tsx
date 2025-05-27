import './App.css'
import Rectangle from "./component/Rectangle";

function App() {
  return (
    <>
      <Rectangle id={1} />
      <Rectangle id={2} x={400} y={600}/>
    </>
  )
}

export default App
