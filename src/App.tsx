import React, { useState } from "react";

function App() {
  const [count, setcount] = useState<number>(0);
  return <div onClick={() => setcount(count + 1)}>카운트 증가{count}</div>;
}

export default App;
