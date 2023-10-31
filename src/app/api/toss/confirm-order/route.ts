import { tossSecretKey } from "@/utils/toss";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const {
    orderId,
    amount,
    paymentKey,
  }: {
    orderId: string;
    amount: number;
    paymentKey: string;
  } = await req.json();
  console.log(orderId, amount, paymentKey);
  try {
    await axios.post(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        orderId,
        amount,
        paymentKey,
      },
      {
        headers: {
          _Authorization: tossSecretKey,
          get Authorization() {
            return this._Authorization;
          },
          set Authorization(value) {
            this._Authorization = value;
          },
          "Content-Type": "application/json",
          "Idempotency-Key": uuidv4(),
        },
      }
    );
  } catch (err) {
    console.error(err);
    Response.json(
      { status: 500, message: "결제 승인에 실패하였습니다." },
      {
        status: 500,
      }
    );
  }
  return Response.json(
    {
      status: 200,
      message: "결제가 승인되었습니다.",
    },
    {
      status: 200,
    }
  );
}
