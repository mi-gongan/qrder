"use client";

import { tossClientKey } from "@/utils/toss";
import React, { useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import axios from "axios";
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
  ANONYMOUS,
} from "@tosspayments/payment-widget-sdk";

function Payment() {
  const orderId = String(Math.random().toString(36).substr(2, 11));
  const amount = 1000;
  const orderName = "test";

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);

  const handlePayment = async () => {
    const paymentWidget = await loadPaymentWidget(tossClientKey, ANONYMOUS);

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: amount }
    );

    paymentWidget.renderAgreement("#agreement");

    paymentWidgetRef.current = paymentWidget;
    paymentMethodsWidgetRef.current = paymentMethodsWidget;
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
        flexDirection: "column",
      }}
    >
      <h1>주문서</h1>
      <div id="payment-widget" style={{ width: "100%" }} />
      <div id="agreement" style={{ width: "100%" }} />
      <button
        style={{
          width: "100%",
          height: "50px",
          borderRadius: "10px",
          backgroundColor: "blue",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
        }}
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current;

          try {
            paymentWidget?.requestPayment({
              orderId: orderId,
              orderName: orderName,
              successUrl: `${window.location.origin}/payment/success`,
              failUrl: `${window.location.origin}/payment/fail`,
            });
          } catch (error) {
            // 에러 처리하기
            console.error(error);
          }
        }}
      >
        결제하기
      </button>
    </div>
  );
}

export default Payment;
