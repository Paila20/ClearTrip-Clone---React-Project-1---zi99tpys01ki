

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Radio, message,Select } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import "../styles/PaymentBooking.css";
import { logosvg } from './Constant';

export default function PaymentBooking() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
   let FirstName = JSON.parse(searchParams.get("FirstName"));
   let Email = JSON.parse(searchParams.get("Email"));
  let amount = searchParams.get("amount");
  const [donepayment, setDonepayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [cardNumber, setCardNumber] = useState('');

  const { Option } = Select;

const months = [
  { month: 'Jan (01)', value: '01' }, { month: 'Feb (02)', value: '02' },
  { month: 'Mar (03)', value: '03' }, { month: 'Apr (04)', value: '04' },
  { month: 'May (05)', value: '05' }, { month: 'Jun (06)', value: '06' },
  { month: 'Jul (07)', value: '07' }, { month: 'Aug (08)', value: '08' },
  { month: 'Sep (09)', value: '09' }, { month: 'Oct (10)', value: '10' },
  { month: 'Nov (11)', value: '11' }, { month: 'Dec (12)', value: '12' }
];

const yearsArray = Array.from({ length: 26 }, (_, index) => 2024 + index);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentDone = (values) => {
    if (values.agreement) {
      setDonepayment(true);
      message.success('Payment successful');
      setTimeout(() => {
        navigate("/");
      }, 7000);
    } else {
      message.error('Please accept the terms and conditions to proceed.');
    }
  };

  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedValue);
    form.setFieldsValue({ cardNumber: formattedValue });
  };

  


  const validateYear = (rule, value) => {
    const currentYear = new Date().getFullYear();
    if (value >= currentYear) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter a valid year');
  };
  return (
    <div className='paymentbooking'>
      <nav className='flexa'>
        <NavLink to='/'>
         
             {logosvg}
        </NavLink>
      </nav>
      <div className={`paymentbookingMaindiv flexja ${donepayment ? "colordiv" : ""}`}>
        {!donepayment ? (
          <Form
            form={form}
            onFinish={handlePaymentDone}
            className='paymentCardouter flex flexc g10'
            initialValues={{
              paymentMethod: 'UPI',
            }}
          >
            <h2>Pay to complete your booking</h2>
            <div className='paymentbookingcard flexa'>
              <div className='paymentcarddiv1 flex flexc g10'>
                <Form.Item name="paymentMethod" className='payment-form'>
               
                <div className='button-container'>
                <Button
                      type={paymentMethod === 'UPI' ? 'primary' : 'default'}
                      onClick={() => handlePaymentMethodChange('UPI')}
                      className='upi'
                    >
                      UPI
                    </Button>
                    <Button
                      type={paymentMethod === 'Debit' ? 'primary' : 'default'}
                      onClick={() => handlePaymentMethodChange('Debit')}
                    >
                      Debit/Credit card
                    </Button>
                </div>
     
                </Form.Item>
              </div>

              {paymentMethod === 'UPI' && (
                <div className='paymentcarddiv1result flex flexjsb'>
                  <div className='paymentcarddiv2 flex flexc g10'>
                    <h3>Enter UPI ID</h3>
                    <Form.Item
                      name="upiId"
                      rules={[
                        { required: true, message: 'Please enter your UPI ID' },
                        { pattern: /.+@.+/, message: 'Please enter a valid UPI ID' },
                      ]}
                    >
                      <Input placeholder='Enter your UPI ID' />
                    </Form.Item>
                    <p>Payment request will be sent to the phone no. linked to your UPI ID</p>
                  </div>
                  <div className='paymentcarddiv3 flexja flexc g10'>
                    <div className='linevertical'></div>
                    <p>OR</p>
                    <div className='linevertical'></div>
                  </div>
                  <div className='paymentcarddiv4 flexa flexc g20'>
                    <h3>SCAN QR CODE</h3>
                    <div className='qrcodepayment'></div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Debit' && (
                <div className='paymentcarddiv5 flex flexc g10'>
                  <h3>Enter card details</h3>
                  <Form.Item
                    name="cardNumber"
                    rules={[
                      { required: true, message: 'Please enter your card number' },
                      { pattern: /^\d{4} \d{4} \d{4} \d{4}$/, message: 'Please enter a valid card number' },
                    ]}
                  >
                    <Input
                      placeholder='Enter card number'
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}  
                    />
                  </Form.Item>
                
                  <div style={{ marginBottom: 0 }} className='selectdiv'>
                    <div  className='Select'>
                    <Form.Item
                      name="expiryMonth"
                     
                      rules={[
                        { required: true, message: 'Please select the expiry month' }
                      ]}
                      // style={{ display: 'inline-block', width: 'calc(30% - 8px)' }}
                    >
                      <Select placeholder="Month">
                        {months.map(item => (
                          <Option key={item.value} value={item.value}>{item.month}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    </div>
                    <div   className='Select'>
                    <Form.Item
                      name="expiryYear"
                   
                      rules={[
                        { required: true, message: 'Please select the expiry year' },
                        { validator: validateYear }
                      ]}
                      // style={{ display: 'inline-block', width: 'calc(30% - 8px)', marginLeft: '16px' }}
                    >
                      <Select placeholder="Year">
                        {yearsArray.map(year => (
                          <Option key={year} value={year}>{year}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    </div>
                    
                  </div>

                  <Form.Item
                    name="cardHolderName"
                    rules={[{ required: true, message: 'Please enter the card holder name' }]}
                  >
                    <Input placeholder='Name as on card' />
                  </Form.Item>
                  <Form.Item
                    name="cvv"
                    rules={[
                      { required: true, message: 'Please enter the CVV' },
                      { pattern: /^\d{3,4}$/, message: 'Please enter a valid CVV' },
                    ]}
                  >
                    <Input placeholder='CVV' maxLength={4} />
                  </Form.Item>
                </div>
              )}
            </div>
            <div className='paymentpolichecker flexa g10'>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    message: 'Please accept the terms and conditions to proceed.',
                  },
                ]}
              >
                <Checkbox>
                  <p>
                    I understand and agree to the rules and restrictions of this fare, the booking policy, the privacy policy and the terms and conditions of Cleartrip and confirm address details entered are correct.
                  </p>
                </Checkbox>
              </Form.Item>
              <div>
                <h2>₹{amount}</h2>
                <p>Total, inclusive of all taxes</p>
              </div>
              <Form.Item>
              {/* <Button  className='paybuttonpayment'>
                Pay now
              </Button> */}
                 <button  className='paybuttonpayment'>Pay now</button>
            </Form.Item>
         
            </div>
           
          </Form>
        ) : (
          <div className='backgroundwhite flexja g20 flexc'>
            <p>{Email}</p>
                   
            <FaCheckCircle color='green' size={200} />
            <p>Your Payment is Done</p>
          </div>
        )}
      </div>
    </div>
  );
}
