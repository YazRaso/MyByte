import React, { useState } from "react";
import AuthComponent from "./auth.js";
import Nutri from "./nutri.js";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <div>
      <AuthComponent setIsSignedIn={setIsSignedIn} />
      {isSignedIn ? <Nutri /> : <p>Please sign in to access features.</p>}
    </div>
  );
}

export default App;
