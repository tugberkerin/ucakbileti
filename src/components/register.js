import React, { useState } from 'react';
import {  Form, Input, Button, message } from 'antd';
import axios from 'axios';

const Register = ({ onOk }) => {
  const [formData, setFormData] = useState({
    kullanici_ad: '',
    kullanici_soyad: '',
    kimlik_no: '',
    tel_no: '',
    sifre: '',
    mail: '',
  });

  const addData = () => {
    axios({
      method: 'post',
      url: 'https://v1.nocodeapi.com/tugberkerin/google_sheets/hyvNPOQnfgdMEGWx?tabId=sayfa1',
      data: [Object.values(formData)],
    })
      .then((response) => {
        // Registration successful
        message.success('Registration successful');
        onOk(formData.kullanici_ad); // Pass kullanici_ad to onOk function
        setFormData({
          kullanici_ad: '',
          kullanici_soyad: '',
          kimlik_no: '',
          tel_no: '',
          sifre: '',
          mail: '',
        });
      })
      .catch((error) => {
        // Registration failed
        message.error('Registration failed');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Form layout="vertical">
      <Form.Item
        label="Kullanıcı Adı"
        name="kullanici_ad"
        rules={[
          { required: true, message: 'Lütfen kullanıcı adınızı giriniz!' },
          {
            pattern: /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/,
            message: 'Kullanıcı adınız sadece harflerden oluşmalıdır!',
          },
        ]}
      >
        <Input name="kullanici_ad" value={formData.kullanici_ad} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Kullanıcı Soyadı"
        name="kullanici_soyad"
        rules={[
          { required: true, message: 'Lütfen soyadınızı giriniz!' },
          {
            pattern: /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/,
            message: 'Soyadınız sadece harflerden oluşmalıdır!',
          },
        ]}
      >
        <Input name="kullanici_soyad" value={formData.kullanici_soyad} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Kimlik Numarası"
        name="kimlik_no"
        rules={[
          {
            required: true,
            message: 'Lütfen kimlik numaranızı giriniz!',
            max: 11,
          },
        ]}
      >
        <Input name="kimlik_no" value={formData.kimlik_no} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Telefon Numarası"
        name="tel_no"
        rules={[{ required: true, message: 'Lütfen telefon numaranızı giriniz!' }]}
      >
        <Input name="tel_no" value={formData.tel_no} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Şifre"
        name="sifre"
        rules={[
          { required: true, message: 'Lütfen şifrenizi giriniz!' },
          { min: 6, message: 'Şifreniz en az 6 karakter olmalıdır!' },
        ]}
      >
        <Input.Password name="sifre" value={formData.sifre} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Mail Adresi"
        name="mail"
        rules={[
          {
            type: 'email',
            message: 'Lütfen geçerli bir email adresi giriniz!',
          },
          { required: true, message: 'Lütfen email adresinizi giriniz!' },
        ]}
      >
        <Input name="mail" value={formData.mail} onChange={handleChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={addData}>
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
