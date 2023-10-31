"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function PaymentSuccess() {
  const searchParam = useSearchParams();
  const paymentType = searchParam.get("paymentType");
  const orderId = searchParam.get("orderId");
  const paymentKey = searchParam.get("paymentKey");
  const amount = searchParam.get("amount");

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!paymentType || !orderId || !paymentKey || !amount) return;
    axios
      .post("/api/toss/confirm-order", {
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      })
      .then((res) => {
        console.log(res);
        setPaymentSuccess(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [paymentType, orderId, paymentKey, amount]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {paymentSuccess ? "결제 성공" : "결제 확인중"}
    </div>
  );
}

export default PaymentSuccess;
