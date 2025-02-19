import { BrowserRouter } from "react-router-dom";
import Routings from "./routings/Routings";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />  
        <Routings />
      </BrowserRouter>
    </>
  );
};

export default App;
