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
  const [status, setStatus] = useState(false);
  const orderId = String(Math.random().toString(36).substr(2, 11));
  const amount = 1000;
  const orderName = "test";

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);

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

  //   useEffect(() => {
  //     handlePayment();
  //   }, []);

  const a = async () => {
    const paymentWidget = await loadPaymentWidget(tossClientKey, ANONYMOUS);
    // const paymentWidget = await loadPaymentWidget(clientKey, ANONYMOUS); // 비회원 결제

    // ------  결제위젯 렌더링 ------
    // https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: amount }
    );

    // ------  이용약관 렌더링 ------
    // https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자
    paymentWidget.renderAgreement("#agreement");

    paymentWidgetRef.current = paymentWidget;
    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  };
  useEffect(() => {
    a();
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
      <h1>주문서</h1>
      <div id="payment-widget" style={{ width: "100%" }} />
      <div id="agreement" style={{ width: "100%" }} />
      <button
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current;

          try {
            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
            paymentWidget
              ?.requestPayment({
                orderId: orderId,
                orderName: "토스 티셔츠 외 2건",
                customerName: "김토스",
                customerEmail: "customer123@gmail.com",
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
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
