import { useState,useEffect } from "react";
import "../styles/Carousal.css";
import { data } from "../components/Constant";

function CarouselHotelFirst() {

    const [slide, setSlide] = useState(0);
    
    function nextSlide() {
        setSlide((slide + 1)%10);
    }
    function prevSlide() {
        if(slide==0){
            setSlide(9);
        }
        else{
        setSlide((slide - 1)%10);
        }
    }

    useEffect(()=>{
        clearInterval(loop);
        const loop=setInterval(() => {
            setSlide(s=>(s+1)%10);
        }, 3000);
    },[])
    return (
        <div className="carousel flexja">
            {
                data.map((item, idx) => {
                    return <img src={item.src} alt={item.alt} key={idx} className={slide == idx ? "slide" : "slide slide-hidden"} />
                })
            }
            <div className="flexa">
                <svg className="arrow arrow-left" onClick={prevSlide} width="5" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9L1 5L5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="indicators">
                    {
                        data.map((_, idx) => {
                            return <button key={idx} onClick={() => setSlide(idx)} className={slide == idx ? "indicator indicator-active" : "indicator indicator-inactive"}></button>
                        })
                    }
                </span>
                <svg className="arrow arrow-right" onClick={nextSlide} width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L5 5L1 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
        </div>
    )
}

export default CarouselHotelFirst;