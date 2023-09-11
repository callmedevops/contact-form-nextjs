"use client";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const notify = (message) => toast(message);

  const clearFormData = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendFormData({ name, email, message });
      clearFormData();
      notify("🚀 Your message is on its way! Thanks for reaching out 😊. Have a fantastic day ahead! 🌟");
    } catch (error) {
      notify(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendFormData(data) {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='mb-5'>
          <label htmlFor='name' className='mb-3 block text-base font-medium text-black'>Full Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            className='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
            required
          />
        </div>
        <div className='mb-5'>
          <label htmlFor='email' className='mb-3 block text-base font-medium text-black'>Email Address</label>
          <input
            type='email'
            placeholder="Enter Your Email "
            className='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='mb-5'>
          <label htmlFor='message' className='mb-3 block text-base font-medium text-black'>Message</label>
          <textarea
            rows={4}
            placeholder="Write Your Message Here..."
            className='w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <button type='submit' disabled={isLoading} className='hover:shadow-form rounded-md bg-blue-500 py-3 px-8 text-base font-semibold text-white outline-none'>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
        </form>
      <ToastContainer />
    </>
  );
};

export default Contact;