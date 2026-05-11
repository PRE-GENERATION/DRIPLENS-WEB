import 'dotenv/config';
import './config/env.js';
import * as authService from './services/authService.js';

async function testRegister() {
  try {
    const res = await authService.register({
      username: 'testbrand_' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'Password123!',
      role: 'brand',
      brand_name: 'Test Brand',
      instagram_handle: 'testbrand',
      website: 'https://test.com',
      contact_person: 'Test Person',
      phone_number: '1234567890'
    });
    console.log('Register successful:', res);
  } catch (err) {
    console.error('Register failed:', err);
  }
}

testRegister();
