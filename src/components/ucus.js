import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, Input, Checkbox, Table, Button, message, Modal, Flex } from "antd";
import moment from "moment";
import Sepet from "./sepet.js"; // Sepet bileşenini import ediyoruz

const { Option } = Select;

const FlightComponent = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filters, setFilters] = useState({
    kalkis_yeri: "",
    varis_yeri: "",
    tarih: "",
    ucak_kod: "",
    sirket: "",
    aktarma: false,
    sortKriter: "",
    userUcusSure: "",
  });
  const [cart, setCart] = useState([]);
  const [departureOptions, setDepartureOptions] = useState([]);
  const [arrivalOptions, setArrivalOptions] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(
        "https://v1.nocodeapi.com/yedekhesap/google_sheets/QiAyIBfNeFVcFLId?tabId=sayfa1"
      )
      .then((response) => {
        const rows = response.data.data;

        const flightData = rows.map((row) => ({
          key: row.id,
          kalkis_yeri: row.kalkis_yeri,
          varis_yeri: row.varis_yeri,
          tarih: moment(row.bilet_tarihi, "DD.MM.YYYY").format("YYYY-MM-DD"),
          ucak_kod: row.ucak_kod,
          sirket: row.sirket_ad,
          aktarma: row.aktarma === "1" ? "Var" : "Yok",
          fiyat: parseFloat(row.fiyat.replace(".", "").replace(",", ".")),
          ucus_sure: row.ucus_sure,
          koltuk_no: row.koltuk_no,
          koltuk_dolubos: row.koltuk_dolubos === "1" ? "Dolu" : "Boş",
        }));

        setFlights(flightData);
        setFilteredFlights(flightData);

        const departures = new Set(
          flightData.map((flight) => flight.kalkis_yeri)
        );
        const arrivals = new Set(flightData.map((flight) => flight.varis_yeri));

        setDepartureOptions([...departures]);
        setArrivalOptions([...arrivals]);
      })
      .catch((error) => {
        console.error("There was an error fetching the flights!", error);
      });
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(":").map(Number);
    return `${hours} saat ${minutes} dakika `;
  };

  const sortFlights = (flights, kriter) => {
    switch (kriter) {
      case "fiyat-asc":
        return flights.slice().sort((a, b) => a.fiyat - b.fiyat);
      case "fiyat-desc":
        return flights.slice().sort((a, b) => b.fiyat - a.fiyat);
      case "sure-asc":
        return flights.slice().sort((a, b) => {
          const aDuration = a.ucus_sure
            .split(":")
            .reduce((acc, time) => 60 * acc + +time, 0);
          const bDuration = b.ucus_sure
            .split(":")
            .reduce((acc, time) => 60 * acc + +time, 0);
          return aDuration - bDuration;
        });
      case "sure-desc":
        return flights.slice().sort((a, b) => {
          const aDuration = a.ucus_sure
            .split(":")
            .reduce((acc, time) => 60 * acc + +time, 0);
          const bDuration = b.ucus_sure
            .split(":")
            .reduce((acc, time) => 60 * acc + +time, 0);
          return bDuration - aDuration;
        });
      default:
        return flights.slice();
    }
  };

  useEffect(() => {
    if (Array.isArray(flights)) {
      let filtered = flights.filter(
        (flight) =>
          (filters.kalkis_yeri
            ? flight.kalkis_yeri === filters.kalkis_yeri
            : true) &&
          (filters.varis_yeri
            ? flight.varis_yeri === filters.varis_yeri
            : true) &&
          (filters.tarih ? flight.tarih === filters.tarih : true) &&
          (filters.ucak_kod ? flight.ucak_kod === filters.ucak_kod : true) &&
          (filters.sirket ? flight.sirket === filters.sirket : true) &&
          (!filters.aktarma || flight.aktarma === "Yok")
      );

      if (filters.userUcusSure) {
        const userUcusSureMinutes = parseInt(filters.userUcusSure, 10);
        filtered = filtered.filter((flight) => {
          const flightDurationMinutes = flight.ucus_sure
            .split(":")
            .reduce((acc, time) => 60 * acc + +time, 0);
          return flightDurationMinutes <= userUcusSureMinutes;
        });
      }
      filtered = sortFlights(filtered, filters.sortKriter);
      filtered = filtered.map((flight) => ({
        ...flight,
        formattedUcusSure: formatDuration(flight.ucus_sure),
      }));
      setFilteredFlights(filtered);
    }
  }, [filters, flights]);

  const handleAddToCart = (flight) => {
    // Koltuğun dolu olup olmadığını kontrol ediyoruz
    if (flight.koltuk_dolubos === "Boş") {
      // Koltuğun sepete daha önce eklenip eklenmediğini kontrol ediyoruz
      const alreadyInCart = cart.some(
        (item) => item.koltuk_no === flight.koltuk_no
      );

      if (!alreadyInCart) {
        setCart([...cart, flight]); // Yeni koltuğu cart state'ine ekliyoruz
        message.success("Koltuk sepete eklendi.");
      } else {
        message.warning("Bu koltuk numarası zaten sepetinizde bulunmaktadır.");
      }
    } else {
      message.warning("Bu koltuk dolu olduğu için sepete eklenemez.");
    }
  };

  const handleRemoveFromCart = (key) => {
    setCart((prevCart) => prevCart.filter((item) => item.key !== key));
  };

  const handleOpenCartModal = () => {
    setIsCartModalOpen(true);
  };

  const handleCloseCartModal = () => {
    setIsCartModalOpen(false);
  };

  const columns = [
    {
      title: "Kalkış Yeri",
      dataIndex: "kalkis_yeri",
      key: "kalkis_yeri",
      sorter: {
        compare: (a, b) => a.kalkis_yeri.localeCompare(b.kalkis_yeri),
        multiple: 1,
      },
    },
    {
      title: "Varış Yeri",
      dataIndex: "varis_yeri",
      key: "varis_yeri",
      sorter: {
        compare: (a, b) => a.varis_yeri.localeCompare(b.varis_yeri),
        multiple: 1,
      },
    },
    {
      title: "Tarih",
      dataIndex: "tarih",
      key: "tarih",
      sorter: {
        compare: (a, b) => moment(a.tarih).unix() - moment(b.tarih).unix(),
        multiple: 1,
      },
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
      sorter: {
        compare: (a, b) => a.fiyat - b.fiyat,
        multiple: 1,
      },
      render: (fiyat) => `${fiyat.toFixed(2)} TRY`,

    },
    {
      title: "Uçuş Süresi",
      dataIndex: "ucus_sure",
      key: "ucus_sure",
      sorter: {
        compare: (a, b) => {
          const aDuration = a.ucus_sure
            .split(":")
            .reduce((acc, time) => 60 * acc + +time, 0);
          const bDuration = b.ucus_sure
            .split(":")
            .reduce((acc, time) => 60 * acc + +time, 0);
          return aDuration - bDuration;
        },
        multiple: 1,
      },
      render: (ucus_sure) => formatDuration(ucus_sure),
    },
    {
      title: "Koltuk No",
      dataIndex: "koltuk_no",
      key: "koltuk_no",
    },
    {
      title: "Koltuk Durumu",
      dataIndex: "koltuk_dolubos",
      key: "koltuk_dolubos",
    },
    {
      title: "Aksiyon",
      key: "action",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleAddToCart(record)}
          disabled={record.koltuk_dolubos === "Dolu"}
        >
          Sepete Ekle
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Uçuş Bilgileri</h1>
      <div>
        <Select
          showSearch
          placeholder="Kalkış Yeri"
          optionFilterProp="children"
          onChange={(value) => handleFilterChange("kalkis_yeri", value)}
          style={{ width: 200, marginRight: 10 }}
        >
          {departureOptions.map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <Select
          showSearch
          placeholder="Varış Yeri"
          optionFilterProp="children"
          onChange={(value) => handleFilterChange("varis_yeri", value)}
          style={{ width: 200, marginRight: 10 }}
        >
          {arrivalOptions.map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <Input
          type="date"
          name="tarih"
          placeholder="Tarih"
          value={filters.tarih}
          onChange={(e) => handleFilterChange("tarih", e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          type="text"
          name="ucak_kod"
          placeholder="Uçak Kodu"
          value={filters.ucak_kod}
          onChange={(e) => handleFilterChange("ucak_kod", e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          type="text"
          name="sirket"
          placeholder="Şirket"
          value={filters.sirket}
          onChange={(e) => handleFilterChange("sirket", e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <Checkbox
          checked={filters.aktarma}
          onChange={(e) => handleFilterChange("aktarma", e.target.checked)}
          style={{ marginLeft: 10 }}
        >
          Aktarmasız Uçuşlar
        </Checkbox>
        <div style={{ marginTop: 20 }}>
          <Button type="primary" onClick={handleOpenCartModal}>
            Sepetim ({cart.length})
          </Button>
          <Modal
          width={Flex}
            title="Sepetim"
            visible={isCartModalOpen}
            onCancel={handleCloseCartModal}
            footer={[
              <Button key="close" onClick={handleCloseCartModal}>
                Kapat
              </Button>,
            ]}
          >
            <Sepet cart={cart} handleRemoveFromCart={handleRemoveFromCart} />
          </Modal>
        </div>
      </div>
      <div>
        <h2>Filtrelenmiş Uçuşlar</h2>
        <Table
          columns={columns}
          dataSource={filteredFlights}
          pagination={{ defaultPageSize: 5 }}
          onChange={(_, __, sorter) => {
            if (sorter) {
              const { columnKey, order } = sorter;
              const sortKriter = `${columnKey}-${
                order === "descend" ? "desc" : "asc"
              }`;
              handleFilterChange("sortKriter", sortKriter);
            }
          }}
        />
      </div>
    </div>
  );
};

export default FlightComponent;