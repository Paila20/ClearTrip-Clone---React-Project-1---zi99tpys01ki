import React, { useState } from 'react'
import CarouselThree from '../SmallComp/CarousalThree';
import "../styles/LoginSignup.css";
import { useAuthContext } from '../components/ContextAllData';
import { baseapi } from '../components/Constant';


export default function LoginSignup({ settokenAvailability, checklogin, formClose }) {
  const [pagination, setpagination] = useState(true);
  const { all, setall } = useAuthContext();
  const [error, seterror] = useState(false);
  const [signName, setsignName] = useState("");
  const [signEmail, setsignEmail] = useState("");
  const [signPassword, setsignPassword] = useState("");
  const [signgender, setsigngender] = useState("");
  const [LoginEmail, setLoginEmail] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");
  const [errorlogin, seterrorlogin] = useState(false);
  const [existusererror, setexistusererror] = useState(false);

  const signupfun = async (e) => {
    e.preventDefault(e);
    if (signName && signEmail && signPassword && signgender) {
      try { 
        const response = await (await fetch(`${baseapi}/signup`,
          {
            method: "POST",
            headers: {
              projectID: "afznkxyf8vti",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `${signName}`,
              email: `${signEmail}`,
              password: `${signPassword}`,
              appType: "bookingportals"
            })
          }
        )).json();
        console.log(response);
        if (response.status == "fail" && response.message == "User already exists") {
          setexistusererror(true);
        }

        if (response.status == "success") {

          localStorage.setItem("token", JSON.stringify(response.token));
          localStorage.setItem("name", JSON.stringify(response.data.name))

          formClose(false);
          settokenAvailability(true);
          setall((prev) => ({ ...prev, ["token"]: response.token}));
          setall((prev) => ({ ...prev, ["name"]: response.data.name}));
        }

      } catch (error) {
        alert(error);
      }

      setsignEmail("");
      setsignName("");
      setsignPassword("");
      setsigngender("");
    }
    else {
      seterror(true)
    }

  }

  const loginfun = async (e) => {
    e.preventDefault(e);
    if (LoginEmail && LoginPassword) {
      try {
        const response = await (await fetch(`${baseapi}/login`,
          {
            method: "POST",
            headers: {
              projectID: "afznkxyf8vti",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: `${LoginEmail}`,
              password: `${LoginPassword}`,
              appType: "bookingportals"
            })
          }
        )).json();
        if (response.status == "success") {
          localStorage.setItem("token", JSON.stringify(response.token));
          localStorage.setItem("name", JSON.stringify(response.data.name));
          formClose(false);
          settokenAvailability(true);
          setall((prev) => ({ ...prev, ["token"]: response.token}));
          setall((prev) => ({ ...prev, ["name"]: response.data.name}));
        }
        else {
          seterrorlogin(true);
        }
      }
      catch (error) {
        alert(error);
      }
      setLoginEmail("");
      setLoginPassword("");
    }
    else {
      seterror(true);
    }

  }



  return (
    <div className='loginBackBlur'>
      <div className='loginMainDiv'>
        <div className='leftlogin'><CarouselThree /></div>
        <div className='rightlogin flexa flexc'>
          <div className='crossSign'>
            <svg onClick={() => { formClose(false); setTimeout(() => { checklogin(); }, 20000); }} width="22" height="22" viewBox="0 0 24 24" fill="none" className=" c-pointer c-neutral-900"><path d="M18 6L12 12M12 12L6 18M12 12L6 6M12 12L18 18" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </div>
          {pagination ?
            (<form className='flexja flexc loginform' onSubmit={(e) => loginfun(e)}>
              <fieldset className='flexja'>
                <legend>Email</legend>
                <input type="email" id="email" name="email" value={LoginEmail} onChange={(e) => { seterrorlogin(false); seterror(false); setLoginEmail(e.target.value) }} /><br />
              </fieldset>
              <fieldset className='flexja'>
                <legend>Password</legend>
                <input type="password" id="password" name="password" value={LoginPassword} onChange={(e) => { seterrorlogin(false); seterror(false); setLoginPassword(e.target.value) }} /><br />
              </fieldset>
              {errorlogin && <p className='errorlogin'>Incorrect EmailId or Password</p>}
              {error && <p className='errors'>Email or Password is Missing</p>}
              <button type='submit' className='SubmitLogin'>Login</button>
              <p className='gotosignup' onClick={() => { seterror(false); setpagination(false) }}>SignUp</p>
            </form>) :
            (
              <form className='flexja formsignup flexc' onSubmit={(e) => signupfun(e)}>
                <fieldset className='flexja'>
                  <legend>Name</legend>
                  <input type="text" id="name" name="name" value={signName} onChange={(e) => { seterror(false); setsignName(e.target.value) }} />
                </fieldset>
                <fieldset className='flexja'>
                  <legend>Email</legend>
                  <input type="email" id="email" name="email" value={signEmail} onChange={(e) => { seterror(false); setsignEmail(e.target.value) }} /><br />
                </fieldset>
                <fieldset className='flexja'>
                  <legend>Password</legend>
                  <input type="password" id="password" name="password" value={signPassword} onChange={(e) => { seterror(false); setsignPassword(e.target.value) }} /><br />
                </fieldset>
                <fieldset className='genderfieldset flexja' >
                  <legend>Gender</legend>
                  <label for="gender" className='flexa g20'>
                    <p className='flexja'><input type="radio" id="male" name="gender" value="Male" checked={signgender === 'Male'} onChange={() => { seterror(false); setsigngender('Male') }} />&nbsp;Male</p>
                    <p className='flexja'><input type="radio" id="female" name="gender" value="Female" checked={signgender === 'Female'} onChange={() => { seterror(false); setsigngender('Female') }} />&nbsp;Female</p>
                    <p className='flexja'><input type="radio" id="other" name="gender" value="Other" checked={signgender === 'Other'} onChange={() => { seterror(false); setsigngender('Other') }} />&nbsp;Other</p>
                  </label>
                </fieldset>
                {error && <p className='errors'>Pls fill all the fields</p>}
                {existusererror && <p className='errors'>User Already Exists</p>}
                <button type='submit' className='SubmitSignup'>Sign Up</button>
                <p className='backtologin' onClick={() => { seterror(false); setpagination(true) }}>Back to Login</p>
              </form>
            )}
        </div>
      </div>
    </div>
  )
}
