import React, { useEffect, useState } from 'react'
import {  airlineNamefinder } from './Constant';
import { clockIcon, circle, owl } from './Constant';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { CiCircleInfo } from "react-icons/ci";
import '../styles/MyTrips.css';
import Footer from "../SmallComp/Footer";
import { logofinder } from './Constant';
import { useAuthContext } from './ContextAllData';
export default function MyTrips() {

    const {  tokenAvailability,checklogin } = useAuthContext();
    const [bookingdata, setBookingdata] = useState([])
    const [toggle, settoggle] = useState(true)
    const senddata = async () => {
        try {
            const response = await (await fetch(`https://academics.newtonschool.co/api/v1/bookingportals/booking`,
                {
                    method: "Get",
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                        projectID: 'afznkxyf8vti',
                        "Content-Type": "application/json",
                    },
                }
            )).json();
            console.log(response)
            setBookingdata(response.data)
        }
        catch (error) {
            alert(error);
        }
    }

    function formatTime(timestamp) {
        const options = { month: 'short', day: 'numeric', weekday: 'short' };
        const formattedTime = new Date(timestamp).toLocaleDateString('en-US', options);
        return formattedTime;
    }

    useEffect(() => {
        if (!tokenAvailability) {
            checklogin();
        }
    }, [tokenAvailability]);

    useEffect(() => {
        if (tokenAvailability) {
            senddata();
        }
    }, [tokenAvailability]);
 
    
    return (
        <div style={{ width: '60vw' }}>
            <h1 className='booking-heading'>Booking history</h1>
            <div className='booking-btn'>
                <button className={toggle ? 'activeBtn' : 'booking-button'} onClick={() => settoggle(true)}>Flight</button> &nbsp;&nbsp;
                <button className={!toggle ? 'activeBtn' : 'booking-button'} onClick={() => settoggle(false)}>Hotels</button>
            </div>

          
            { tokenAvailability &&
            toggle && bookingdata.length > 0 && bookingdata.map((item, index) => item.booking_type === 'flight' && (
                <div key={index} className="booking-flight-details">
                    <div className="booking-flight-details-header ">
                        <div className="booking-header-head1 ">
                            <h4>{item.flight.source} <HiOutlineArrowNarrowRight /> {item.flight.destination}</h4>
                            <p>{formatTime(item.created_at)}</p>
                        </div>
                        <div className="booking-header-head2 ">
                            <h6>Partially Refundable</h6>
                        </div>
                    </div>
                    <div className="booking-airline ">
                        <div className="booking-sec1">
                            <div>
                                <img src={logofinder(item.flight)} />
                            </div>
                            <div className="booking-airline-name">
                                <h5>{airlineNamefinder(item.flight)}</h5>
                            </div>
                            <div className='booking-col'>
                                <h6>{item.flight.flightID.slice(0, 2)}-{item.flight.flightID.slice(13, 16)}</h6>
                                
                            </div>
                        </div>
                        <div className="bookingdetails-expanded ">
                            <div className="bookingdetails-expanded-sec1">
                                <div className="sec1"><h3>{item.flight.source}</h3><h4>{item.flight.departureTime}</h4></div>
                                <p>{formatTime(item.start_date)}</p>
                            </div>
                            <div className="bookingdetails-expanded-sec2">
                            
                                <p>{item.flight.duration}h {item.flight.duration}m</p>
                            </div>
                            <div className="bookingdetails-expanded-sec3">
                                <div className="sec1"><h3>{item.flight.destination}</h3><h4>{item.flight.arrivalTime}</h4></div>
                                <p>{formatTime(item.end_date)}</p>
                            </div>
                            <div className="bookingdetails-expanded-sec4">
                                <p>Check-in baggage</p>
                                <p>Cabin baggage</p>
                            </div>
                           
                        </div>
                    </div>
                </div>
            ))
            }


         
            <div className='booking-hotel-trip '>
                { tokenAvailability && bookingdata && !toggle && bookingdata.map((item, index) => item.booking_type === 'hotel' && (
                    <div className='booking-hotelinfo-left-card'>
                        <div className=' booking-hotelinfo '>
                            <div className='booking-hotel-col'>
                             
                                <h3>{item.hotel.name} {item.hotel.location}</h3>
                 
                                <div className=''>Status : {item.status}</div>
                            </div>
                        </div>
                        <div className='booking-hotelinfo-sec2 '>
                            <div className='flex'>
                                <div className='booking-hotelinfo-check'>
                                    <div>
                                        <p>Check-in</p>
                                        <h2>{formatTime(item.start_date)}</h2>
                                    </div>
                                   
                                    <div>
                                        <p>Check-out</p>
                                        <h2>{formatTime(item.end_date)}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* <Footer/> */}

        </div>
    )
}
