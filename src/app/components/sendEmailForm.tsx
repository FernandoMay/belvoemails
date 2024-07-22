"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID!, process.env.AWS_SECRET_ACCESS_KEY!),
});

const pinpoint = new AWS.Pinpoint();

const SendEmailForm: React.FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const params = {
      ApplicationId: process.env.PINPOINT_APP_ID!,
      MessageRequest: {
        Addresses: {
          [data.to]: {
            ChannelType: 'EMAIL',
          },
        },
        MessageConfiguration: {
          EmailMessage: {
            FromAddress: data.from,
            SimpleEmail: {
              Subject: {
                Charset: 'UTF-8',
                Data: data.subject,
              },
              HtmlPart: {
                Charset: 'UTF-8',
                Data: `${data.body} <br /><a href="https://google.com">Google</a>`,
              },
            },
          },
        },
      },
    };

    try {
      const response = await pinpoint.sendMessages(params).promise();
      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('to')} placeholder="To" required />
      <input {...register('from')} placeholder="From" required />
      <input {...register('subject')} placeholder="Subject" required />
      <textarea {...register('body')} placeholder="Body" required />
      <input type="file" {...register('attachment')} accept="application/pdf" />
      <button type="submit">Send Email</button>
    </form>
  );
};

export default SendEmailForm;
