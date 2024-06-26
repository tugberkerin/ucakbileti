import React, { useState } from "react";
import { Button, Modal, Form, Input, notification, Row } from "antd";

const OdemeModal = ({ visible,handleCloseModal, onSuccessPayment }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      // Payment success notification
      notification.success({
        message: "Ödeme Başarılı",
        description: "Ödeme yapılmıştır. Fatura mail olarak gönderilmiştir.",
      });
      onSuccessPayment();
      form.resetFields(); // Clear the form
      handleCloseModal(); // Close the modal
    } catch (errorInfo) {
      console.error("Ödeme işlemi sırasında bir hata oluştu:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Clear the form
    handleCloseModal(); // Close the modal
  };

  return (
    <Modal
      title="Ödeme Yap"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="submit" type="primary" loading={loading} onClick={handleOk} >
          Ödeme Yap
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">

        <Form.Item
          label="Kart Numarası"
          name="kart_no"
          rules={[
            { required: true, message: "Lütfen kart numaranızı girin!" },
            { pattern: /^[0-9]{16}$/, message: "Geçersiz kart numarası!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Son Kullanma Tarihi" style={{ marginBottom: 0 }}>
        <Row><Form.Item
        label="Kart Ay"
        name="kart_ay"
        rules={[{ required: true, message: "Kartınızın ay bilgisini girin!" },{ pattern: /^[0-9]{2}$/, message: "Geçersiz ay bilgisi!" },]}
      >
        <Input
        style={{width:"50%"}}
          name="kart_ay" placeholder="Ay"
        ></Input>
      </Form.Item>
      <Form.Item
        label="Kart Yıl"
        name="kart_yıl"
        rules={[{ required: true, message: "Kartınızın yıl bilgisini girin!" },{ pattern: /^[0-9]{2}$/, message: "Geçersiz yıl bilgisi numarası!" },]}
      >
        <Input
        style={{width:"50%"}}
          name="kart_yıl" placeholder="Yıl"
        ></Input>
      </Form.Item></Row>
      </Form.Item>
        <Form.Item
          label="CVV"
          name="kart_cvv"
          rules={[{ required: true, message: "Lütfen CVV numaranızı girin!" },{ pattern: /^[0-9]{3}$/, message: "Geçersiz CVV numarası!" },]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OdemeModal;
