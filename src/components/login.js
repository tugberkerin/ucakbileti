import React from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const Login = ({ onOk }) => {
  const onFinish = async (values) => {
    try {
      const response = await axios.get("https://v1.nocodeapi.com/yedekhesap/google_sheets/StIYAOTjYArHcRUE?tabId=sayfa1");
      const users = response.data.data;
      const user = users.find(
        (user) => user.mail === values.email && user.sifre === values.password
      );

      if (user) {
        onOk({
          Kullanici_Ad: user.kullanici_ad,
          Kullanici_Soyad: user.kullanici_soyad,
        });
      } else {
        message.error("Geçersiz email veya şifre. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Giriş başarısız oldu. Lütfen e-postanızı ve şifrenizi kontrol edin.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill in all required fields.");
  };

  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Lütfen e-postanızı girin!" },
          { type: "email", message: "Giriş geçerli değil E-posta!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Şifre"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
