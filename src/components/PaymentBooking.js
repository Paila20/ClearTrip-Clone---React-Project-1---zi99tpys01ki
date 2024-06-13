

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Radio, message } from 'antd';
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

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
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

  const validateYear = (_, value) => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(value, 10);
    if (isNaN(year) || year < currentYear || year > currentYear + 10) {
      return Promise.reject(new Error('Please enter a valid year'));
    }
    return Promise.resolve();
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
                <Form.Item name="paymentMethod">
                  <Radio.Group onChange={handlePaymentMethodChange}>
                    <Radio.Button value="UPI">UPI</Radio.Button>
                    <Radio.Button value="Debit">Debit/Credit card</Radio.Button>
                  </Radio.Group>
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
                  <Form.Item
                    
                    style={{ marginBottom: 0 }}
                  >
                    <Form.Item
                      name="expiryMonth"
                      rules={[
                        { required: true, message: 'Please enter the expiry month' },
                        { pattern: /^(0?[1-9]|1[0-2])$/, message: 'Please enter a valid month' },
                      ]}
                      style={{ display: 'inline-block' }}
                    >
                      <Input placeholder='MM' maxLength={2} />
                    </Form.Item>
                    <Form.Item
                      name="expiryYear"
                      rules={[
                        { required: true },
                        { validator: validateYear },
                      ]}
                      style={{ display: 'inline-block' }}
                    >
                      <Input placeholder='YYYY' maxLength={4} />
                    </Form.Item>
                  </Form.Item>
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
              <Button type="primary" htmlType="submit" className='paybuttonpayment'>
                Pay now
              </Button>
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
