
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Flights from "./Flights";
import Navbar from "./Navbar";
// import 'antd/dist/reset.css';
import Hotels from "./Hotels";
import Flightsresult from "./FlightsResult";
import HotelsResult from "./HotelsResult";
import FlightInfo from "./FlightInfo";
import ContextAllDataProvider from './ContextAllData';
import PaymentBooking from './PaymentBooking';
import HotelsCardInfo from './HotelsCardInfo';
import Hotelpayment from '../SmallComp/Hotelpayment';
import { Maintenance } from '../SmallComp/Maintenance';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyTrips from "./MyTrips";




function App() {
  
  return (
  <div >
    <ContextAllDataProvider>
    <ToastContainer/>
    <Router> 

      <Routes>
        <Route path="/" element={<Navbar/>}>
        <Route index element={<Flights/>}/>
        <Route path="/flights"  element={<Flights/>}/>
        <Route path="/hotels" element={<Hotels/>}/>
        <Route path="/trips" element={<MyTrips/>}/>
        </Route>
               
        <Route path="/flights/:results" element={<Flightsresult/>}/>
        <Route path="/hotels/:results" element={<HotelsResult/>}/>
        <Route path="/flights/results/:Info" element={<FlightInfo/>}/>
        <Route path="/flights/results/flightInfo/:paymentBooking" element={<PaymentBooking/>}/>
        <Route path="/hotels/results/:hotelInfo" element={<HotelsCardInfo/>}/>
        <Route path="/hotels/results/hotelInfo/:info" element={<Hotelpayment/>}/>
        <Route path="/hotels/results/hotelInfo/Info/:paymentBooking" element={<PaymentBooking/>}/>
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </Router>
    {/* </ToastContainer> */}
   
    </ContextAllDataProvider>
  </div>
  )
}

export default App;
