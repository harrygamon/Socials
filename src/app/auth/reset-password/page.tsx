import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
} 