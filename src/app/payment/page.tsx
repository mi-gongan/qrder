"use client";

import { tossClientKey } from "@/utils/toss";
import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import axios from "axios";

function Payment() {
  const [status, setStatus] = useState(false);
  const orderId = String(Math.random().toString(36).substr(2, 11));
  const amount = 1000;
  const orderName = "test";

  const handlePayment = async () => {
    const payments = await loadTossPayments(tossClientKey);
    payments
      .requestPayment("CARD", {
        amount: amount,
        orderId: orderId,
        orderName: orderName,
      })
      .then(async (paymentResult) => {
        console.log(paymentResult);
        if (!paymentResult?.paymentKey) return;
        const res = (
          await axios.post("/api/toss/confirm-order", {
            orderId: orderId,
            amount: amount,
            paymentKey: paymentResult.paymentKey,
          })
        ).data;
        if (res.status === 200) setStatus(true);
      });
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {status ? "결제 완료" : "결제 중"}
    </div>
  );
}

export default Payment;
