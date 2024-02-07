import React from 'react'
import "../styles/Footer.css";
import { footerlogo, footericon1, footericon2, footericon3, footericon4 } from '../components/Constant';


export default function Footer() {
    return (
        <div className='Footermainouterdiv'>
            <div className='footer flexa flexc'>
                <div className='footermaindiv flex g20'>
                    <div className='footermaindivinner'>
                        <div>
                            {footerlogo}
                        </div>
                        <div className='footercardright flex  flexc'>
                            <div className='flexa footercardrightupper'>
                                <div className='flex g40'>
                                    <div className='flex g40'>
                                        <p>About Us</p>
                                        <p>Careers</p>
                                    </div>
                                    <div className='flex g40'><p>FAQ<span>s</span></p>
                                        <p>Support</p>
                                    </div>
                                </div>
                                <div className='flex g40'>
                                    <div className='flex g40'>
                                        <p>Blog</p>
                                        <p>Collections</p>
                                    </div>
                                    <div className='flex g40'>
                                        <p>Gift Cards</p>
                                        <p>Holiday Planners</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex footercardrightbottom'>
                                <div className='flex'>
                                    <span>©</span><div className='flex'><p className='wrap500'>2024 Cleartrip Pvt. Ltd · Privacy · Security · Terms of Use · Grievance Redressal</p></div>
                                </div>
                                <div className='logosocail flexa'>
                                    Connect
                                    {footericon1}
                                    {footericon2}
                                    {footericon3}
                                    {footericon4}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
