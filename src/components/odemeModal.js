import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const OdemeModal = ({ userInfo, handleCloseModal, onSuccessPayment }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);

      // Ödeme işlemlerini burada yapabilirsiniz, örneğin API ile kart bilgilerini kontrol edebilirsiniz
      // Burada sadece örnek bir işlem yapılıyor

      // Kullanıcı bilgilerini alalım
      const { kart_no, kart_ay, kart_yil, kart_cvv } = form.getFieldsValue();

      // API'ye kullanıcının kart bilgileri ile bir istek gönderelim
      // Bu adımı, gerçek bir ödeme sağlayıcı entegrasyonu ve güvenlik doğrulamalarıyla uygulamak önemlidir

      // Örnek: Kart bilgilerini kontrol eden bir API çağrısı
      const response = await axios.post('/api/odeme-kontrol', {
        kart_no,
        kart_ay,
        kart_yil,
        kart_cvv,
        kullanici_id: userInfo.id, // Örnekte userInfo'da kullanıcı ID'si varsa kullanıyorum
      });

      if (response.data.success) {
        // Başarılı bir şekilde ödeme yapıldı
        onSuccessPayment();
        message.success('Ödeme işlemi başarıyla tamamlandı!');
      } else {
        // Ödeme işlemi başarısız oldu
        message.error('Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.');
      }

      setLoading(false);
      handleCloseModal();
    } catch (error) {
      console.error('Ödeme işlemi sırasında bir hata oluştu:', error);
      setLoading(false);
      message.error('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Modal
      title="Ödeme Yap"
      visible={true}
      onCancel={handleCloseModal}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          İptal
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Ödeme Yap
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Kart Numarası"
          name="kart_no"
          rules={[
            { required: true, message: 'Lütfen kart numaranızı girin!' },
            { pattern: /^[0-9]{16}$/, message: 'Geçersiz kart numarası!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Son Kullanma Tarihi" style={{ marginBottom: 0 }}>
          <Input.Group compact>
            <Form.Item
              name="kart_ay"
              noStyle
              rules={[{ required: true, message: 'Ay bilgisini girin!' }]}
            >
              <Input style={{ width: '50%' }} placeholder="Ay" />
            </Form.Item>
            <Form.Item
              name="kart_yil"
              noStyle
              rules={[{ required: true, message: 'Yıl bilgisini girin!' }]}
            >
              <Input style={{ width: '50%' }} placeholder="Yıl" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="CVV"
          name="kart_cvv"
          rules={[{ required: true, message: 'Lütfen CVV numaranızı girin!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OdemeModal;
