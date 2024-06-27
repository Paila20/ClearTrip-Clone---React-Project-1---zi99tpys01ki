
import React, { useState } from 'react';
import { Form, Input, Button, Radio, message,Select } from 'antd';
// import 'antd/dist/antd.css';
// import './antd.css';
import CarouselThree from '../SmallComp/CarousalThree';
import "../styles/LoginSignup.css";
import { useAuthContext } from '../components/ContextAllData';
import { baseapi } from '../components/Constant';

export default function LoginSignup({ settokenAvailability,  setlogincheck }) {
  const [pagination, setpagination] = useState(true);
  const { all, setall } = useAuthContext();
  const [existusererror, setexistusererror] = useState(false);
  const [loginerror, setloginerror] = useState(false);
  const [error , seterror] = useState(false);
  const [signupForm] = Form.useForm();
  const [loginForm] = Form.useForm();

  const { Option } = Select;

  const onFinishSignup = async (values) => {
    try {
      const response = await (await fetch(`${baseapi}/signup`, {
        method: "POST",
        headers: {
          projectID: "afznkxyf8vti",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          gender: values.gender,
          appType: "bookingportals"
        })
      })).json();

      if (response.status === "fail" && response.message === "User already exists") {
        setexistusererror(true);
      } else if (response.status === "success") {
        localStorage.setItem("token", JSON.stringify(response.token));
        localStorage.setItem("user", JSON.stringify(response.data.user.name));

        setlogincheck(false);
        settokenAvailability(true);
        setall((prev) => ({ ...prev, token: response.token }));
      }
    } catch (error) {
      message.error(error.message);
    }
    signupForm.resetFields();
  };

  const onFinishLogin = async (values) => {
    try {
      const response = await (await fetch(`${baseapi}/login`, {
        method: "POST",
        headers: {
          projectID: "afznkxyf8vti",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          appType: "bookingportals"
        })
      })).json();
      console.log(response);

      if (response.status === "success") {
        localStorage.setItem("token", JSON.stringify(response.token));
        localStorage.setItem("user", JSON.stringify(response.data.user.name));

        setlogincheck(false);
        settokenAvailability(true); 
        setall((prev) => ({ ...prev, token: response.token })); 
      } 
     
    } 
    catch (error) {
      setloginerror(true); 
     }
    loginForm.resetFields();
  };

  return (
    <div className='loginBackBlur'>
      <div className='loginMainDiv'>
        <div className='leftlogin'><CarouselThree /></div>
        <div className='rightlogin flexa flexc'>
          <div className='crossSign'>
            <svg onClick={() => { setlogincheck(false);  }} width="22" height="22" viewBox="0 0 24 24" fill="none" className=" c-pointer c-neutral-900"><path d="M18 6L12 12M12 12L6 18M12 12L6 6M12 12L18 18" stroke="#1A1A1A" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </div>
          {pagination ?
            (
              <Form form={loginForm} className='flexja flexc loginform' onFinish={onFinishLogin}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
                >
                  <Input placeholder="Email" className='inputField' />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Password" className='passField' />
                </Form.Item>
                {loginerror && <p className='errorlogin'>Incorrect Email or Password</p>}
                <Button type="primary" htmlType="submit" className='SubmitLogin'>Login</Button>
                <div className='flex g20 flexc '>
                  <div className='flex flexj g20'>
                  <p className='goto  flex'>Don' t have an account?</p>
                  <p className='gotosignup' onClick={() => { seterror(false); setpagination(false) }}>SignUp</p>
                  </div>
               
                <div className='flex g20 flexc'>
                <p className='login-number-option'>We now support mobile number based login. The option will be available soon</p>
                <p className='login-terms-policy'>By continuing, you agree to Cleartrip's <span className='blue'>privacy policy</span>  &
                <span className='blue'>terms of use.</span></p>
                </div>
               
                </div>
                
              </Form>
            ) :
            (
              <Form form={signupForm} className='flexja formsignup flexc' onFinish={onFinishSignup}>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input placeholder="Name" className='inputField' />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
                >
                  <Input placeholder="Email" className='inputField' />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Password" className='passField' />
                </Form.Item>
                {/* <Form.Item
                  name="gender"
                  // rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                  

                  <Select placeholder="Gender">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item> */}
                {existusererror && <p className='errors'>User Already Exists</p>}
                <Button type="primary" htmlType="submit" className='SubmitSignup'>Sign Up</Button>
                <div className='flex flexjsb g20'>
                <span className='goto '>Already a user?</span>
                <p className='backtologin' onClick={() => { seterror(false); setpagination(true) }}>Login</p>
                </div>
                <p className='signup-number-option'>We now support mobile number based login. The option will be available soon</p>
                <p className='signup-terms-policy'>By continuing, you agree to Cleartrip's <span className='blue'>privacy policy</span> &
                <span className='blue'>terms of use.</span></p>
              
              </Form>
            )}
        </div>

      </div>
    </div>
  );
}


{/* <Radio.Group>
                    <Radio value="Male">Male</Radio>
                    <Radio value="Female">Female</Radio>
                    <Radio value="Other">Other</Radio>
                  </Radio.Group> */}