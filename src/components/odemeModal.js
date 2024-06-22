import React, { useState } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import { duration } from "moment";

const OdemeModal = ({ visible, handleCloseModal, onSuccessPayment }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      // Ödeme işlemi yapıldı bildirimi
      notification.success({
        message: "Ödeme Başarılı",
        description: "Ödeme yapılmıştır. Fatura mail olarak gönderilmiştir.",
      });
      onSuccessPayment();
      form.resetFields(); // Formu temizle
      handleCloseModal({duration:0.10}); // Modalı kapat
    } catch (errorInfo) {
      console.error("Ödeme işlemi sırasında bir hata oluştu:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields(); // Formu temizle
    handleCloseModal(); // Modalı kapat
  };

  return (
    <Modal
      title="Ödeme Yap"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={[
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}  >
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
          <Input.Group compact>
            <Form.Item
              name="kart_ay"
              noStyle
              rules={[{ required: true, message: "Ay bilgisini girin!" },{ pattern: /^[0-9]{2}$/, message: "Geçersiz kart numarası!" },]}
            >
              <Input style={{ width: "50%" }} placeholder="Ay" />
            </Form.Item>
            <Form.Item
              name="kart_yil"
              noStyle
              rules={[{ required: true, message: "Yıl bilgisini girin!" },{ pattern: /^[0-9]{2}$/, message: "Geçersiz kart numarası!" },]}
            >
              <Input style={{ width: "50%" }} placeholder="Yıl" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="CVV"
          name="kart_cvv"
          rules={[{ required: true, message: "Lütfen CVV numaranızı girin!" },{ pattern: /^[0-9]{3}$/, message: "Geçersiz kart numarası!" },]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OdemeModal;