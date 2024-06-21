import React from "react";
import { Table, Button } from "antd";

const Sepet = ({ cart, handleRemoveFromCart }) => {
  const columns = [
    {
      title: "Kalkış Yeri",
      dataIndex: "kalkis_yeri",
      key: "kalkis_yeri",
    },
    {
      title: "Varış Yeri",
      dataIndex: "varis_yeri",
      key: "varis_yeri",
    },
    {
      title: "Tarih",
      dataIndex: "tarih",
      key: "tarih",
    },
    {
      title: "Uçak Kodu",
      dataIndex: "ucak_kod",
      key: "ucak_kod",
    },
    {
      title: "Şirket",
      dataIndex: "sirket",
      key: "sirket",
    },
    {
      title: "Aktarma",
      dataIndex: "aktarma",
      key: "aktarma",
    },
    {
      title: "Fiyat",
      dataIndex: "fiyat",
      key: "fiyat",
      render: (fiyat) => `${fiyat.toFixed(2)} TRY`,

    },
    {
      title: "Uçuş Süresi",
      dataIndex: "ucus_sure",
      key: "ucus_sure",
    },
    {
      title: "Koltuk No",
      dataIndex: "koltuk_no",
      key: "koltuk_no",
    },
    {
      title: "Aksiyon",
      key: "remove",
      render: (text, record) => (
        <Button type="danger" onClick={() => handleRemoveFromCart(record.key)}>
          Sil
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cart}
      pagination={false}
      rowKey={(record) => record.key}
      footer={() => (
        <div style={{ textAlign: "right", fontWeight: "bold" }}>
          Toplam Fiyat:{" "}
          {cart.reduce((total, item) => total + item.fiyat, 0).toFixed(2)} TRY
        
        
        
        </div>
        
      )}
    />
  );
};

export default Sepet;