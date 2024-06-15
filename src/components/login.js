import React from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const Login = ({ onOk }) => {
  const onFinish = async (values) => {
    try {
      // Kullanıcıyı doğrulamak için API'ye GET isteği gönderme
      axios({
        method: "get",
        url: "https://v1.nocodeapi.com/tugberkerin/google_sheets/hyvNPOQnfgdMEGWx?tabId=sayfa1",
      }).then(function (response) {
        const users = response.data.data;

        // Kullanıcı doğrulaması
        const user = users.find(
          (user) => user.mail === values.email && user.sifre === values.password
        );

        if (user) {
          // Başarı durumunda modalı kapat ve başarı mesajı göster
          onOk();
          
        } else {
          // Hata mesajı göster
          message.error("Invalid email or password. Please try again.");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      message.error("Login failed. Please check your email and password.");
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
          { required: true, message: "Please input your email!" },
          { type: "email", message: "The input is not valid E-mail!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
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