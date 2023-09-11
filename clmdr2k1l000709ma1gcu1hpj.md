---
title: "Email contact form using NextJS 13"
seoDescription: "Email contact form using NextJS 13"
datePublished: Sun Sep 10 2023 17:49:46 GMT+0000 (Coordinated Universal Time)
cuid: clmdr2k1l000709ma1gcu1hpj
slug: email-contact-form-using-nextjs-13
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1694341564503/7b27447c-2ee0-4e26-8cb8-4aeba35a7acb.png
tags: email-contact-form-using-nextjs-13

---

A Brief Guide on Setting Up a Contact Form in Next.js with App Router and Sending Emails via Nodemailer.

### **An overview of what we’ll be doing here**

Build a contact form using Next.js and the app router. We'll design the form UI and then set up an API route to send emails through Nodemailer to our Gmail with form data.

### Creating a new NextJS project.

```bash
npm create next-app contact-form
```

Open the contact-form folder in **VSCode** (or any IDE you use).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1694341307207/0ddd3ce1-7709-4008-9441-84b01b390645.png align="center")

The server now starts at [**http://localhost:3000**](http://localhost:3000). You can view the website by going to this URL. ( If your 3000 port, it will be in consecutive order like 3001,3002, and so on..)

![Default NextJS starting page](https://cdn.hashnode.com/res/hashnode/image/upload/v1690273110789/faf86f3c-1442-43dd-82cc-c4dba0d64c02.png?auto=compress,format&format=webp align="left")

### **Creating a simple contact form**

You can start by editing app/page.tsx and remove excess code, keeping only the main tag. We'll build our form there. The form needs to be a client component. Instead of converting page.tsx (not advised), create a component folder with a new file: contact.jsx for the form.  
Lastly, install react-hook-form for form management.

```bash
npm i react-hook-form
```

Also, we will be separating the email-sending logic into a separate file in the utils folder to simplify our codebase.

![Basic UI flow](https://cdn.hashnode.com/res/hashnode/image/upload/v1690273115742/42282f6d-2bf6-44a2-921f-aad9b9e0e79a.png?auto=compress,format&format=webp align="left")

For Simplicity, code is here, enjoy. for *<mark>app/page.tsx</mark>*

```bash

import Contact from '@/components/contact';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 bg-white'>
      <Contact />
    </main>
  );
}
```

Add one more npm package for the animation of sending a message from this [package](https://www.npmjs.com/package/react-toastify)

```bash
npm install --save react-toastify
```

*<mark>components/contact.tsx</mark>*

```bash
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
```

*<mark>utils/send-email.ts</mark>*

```bash
import { FormData } from '@/components/contact';

export async function sendEmail(data: FormData) {
  const apiEndpoint = '/api/email';

  fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      alert(response.message);
      return true
    })
    .catch((err) => {
      alert(err);
    });
}
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1694367254492/082aaa33-e3cb-4a65-ba72-d44152b243e9.png align="center")

### **Setting up Nodemailer and API**

Now that our basic form is completed, let’s build our API using **route handlers** in NextJS. But first, we need to install **nodemailer**. Nodemailer is a module for Node.js that makes sending emails from a server an easy task. To install it along with its types:

```bash
npm i nodemailer @types/nodemailer
```

Create a new folder **api** and another folder **email** inside it. Now create a new file **route.ts** inside it. The file path will be **app/api/email/route.ts**. It is done this way to create our api with the endpoint as **“api/email”**. Check out [**this doc**](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) for more information. The current project structure will be as follows:

```bash
import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: NextRequest) {
  const { email, name, message } = await request.json();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `Message from ${name} (${email})`,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
```

Create *<mark>.env </mark>* for storing your Gmail Credentils.

Finally your **VSCode** looks like this below.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1694340872828/13e3df3d-80fd-4e17-bc7d-7664e280ac4a.png align="center")

After Filling all the details, and clicking **send** button you will see this message in top right corner.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1694367741451/5c1df6e5-d644-408b-90e6-4679c67a67b2.png align="center")

Here all the functions for the above form are verified and you can see new email to your **Gmail**

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1694367918282/4643cc6e-27b8-44c9-88c0-ea4e2f0553e2.png align="center")