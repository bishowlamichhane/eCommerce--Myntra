import React from "react";
import { addProduct } from "../firebase/firebase";

const AddItem = () => {
  const itemsToAdd = [
    {
      company: "Nivea",
      current_price: 142,
      delivery_date: "10 Oct 2023",
      discount_percetage: 50,
      image: "images/8.jpg",
      item_name: "Men Fresh Deodrant 150ml",
      original_price: 285,
      rating: {
        count: 5200,
        stars: 4.2,
      },
      retuen_period: 14,
    },
    {
      company: "CUKOO",
      current_price: 899,
      delivery_date: "12 Jun 2025",
      discount_percetage: 40,
      image: "images/2.jpg",
      item_name: "Women Padded Halter Neck Swimming Dress",
      original_price: 1499,
      rating: {
        count: 870,
        stars: 4.1,
      },
      retuen_period: 10,
    },
    {
      company: "Carlton London",
      current_price: 499,
      delivery_date: "14 Jun 2025",
      discount_percetage: 50,
      image: "images/1.jpg",
      item_name: "Rhodium-Plated CZ Floral Studs",
      original_price: 999,
      rating: {
        count: 1320,
        stars: 4.4,
      },
      retuen_period: 7,
    },
    {
      company: "The Indian Garage Co",
      current_price: 799,
      delivery_date: "11 Jun 2025",
      discount_percetage: 36,
      image: "images/7.jpg",
      item_name: "Men Slim Regular Shorts",
      original_price: 1249,
      rating: {
        count: 2450,
        stars: 4.2,
      },
      retuen_period: 15,
    },
    {
      company: "Nike",
      current_price: 7495,
      delivery_date: "15 Jun 2025",
      discount_percetage: 25,
      image: "images/6.jpg",
      item_name: "Men ReactX Running Shoes",
      original_price: 9995,
      rating: {
        count: 3100,
        stars: 4.6,
      },
      retuen_period: 14,
    },
    {
      company: "ADIDAS",
      current_price: 999,
      delivery_date: "13 Jun 2025",
      discount_percetage: 33,
      image: "images/4.jpg",
      item_name: "Indian Cricket ODI Jersey",
      original_price: 1499,
      rating: {
        count: 5200,
        stars: 4.5,
      },
      retuen_period: 10,
    },
    {
      company: "NUEVOSDAMAS",
      current_price: 699,
      delivery_date: "10 Jun 2025",
      discount_percetage: 30,
      image: "images/3.jpg",
      item_name: "Women Red & White Printed A-Line Knee-Length Skirts",
      original_price: 999,
      rating: {
        count: 1800,
        stars: 4.3,
      },
      retuen_period: 12,
    },
    {
      company: "Roadster",
      current_price: 399,
      delivery_date: "10 Jun 2025",
      discount_percetage: 50,
      image: "images/5.jpg",
      item_name: "Pure Cotton T-shirt",
      original_price: 799,
      rating: {
        count: 8000,
        stars: 4.1,
      },
      retuen_period: 7,
    },
  ];

  const addItems = async () => {
    try {
      const promises = itemsToAdd.map((item) => addProduct(item));
      await Promise.all(promises);
      alert("All items added successfully!");
    } catch (err) {
      console.error("Error adding one or more items:", err);
    }
  };

  return (
    <div>
      <button onClick={addItems}>Click to add</button>
    </div>
  );
};

export default AddItem;
