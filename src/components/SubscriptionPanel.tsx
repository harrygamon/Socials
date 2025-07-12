import { SubscriptionStatus } from "./SubscriptionStatus";
import { SubscribeButton } from "./SubscribeButton";

export default function SubscriptionPanel() {
  return (
    <div>
      <SubscriptionStatus />
      <SubscribeButton plan="SILVER" />
      <SubscribeButton plan="GOLD" />
    </div>
  );
} 