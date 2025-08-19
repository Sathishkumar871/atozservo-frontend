import React, { useEffect, useState } from "react";
import socket from "../../socket";
import './OrderTrackingPanel.css';

interface OrderTrackingProps {
  orderId: string;
  userId: string;
}

const OrderTrackingPanel: React.FC<OrderTrackingProps> = ({ orderId, userId }) => {
  const [status, setStatus] = useState("Waiting for acceptance");
  const [deliveryBoy, setDeliveryBoy] = useState<{name: string, lat: number, lng: number} | null>(null);

  useEffect(() => {
    socket.emit("joinOrderTracking", { orderId, userId });

    socket.on("orderStatusUpdate", (newStatus: string) => setStatus(newStatus));
    socket.on("deliveryBoyLocation", (data: {name: string, lat: number, lng: number}) => setDeliveryBoy(data));

    return () => {
      socket.off("orderStatusUpdate");
      socket.off("deliveryBoyLocation");
    };
  }, [orderId, userId]);

  return (
    <div className="order-tracking-panel">
      <div className="order-tracking-header">Order Tracking</div>
      <div className="order-tracking-body">
        <div className="order-status">
          <div className="status-dot"></div>
          <span>{status}</span>
        </div>
        {deliveryBoy && (
          <div>
            <p>Delivery: {deliveryBoy.name}</p>
            <p>Lat: {deliveryBoy.lat.toFixed(3)}, Lng: {deliveryBoy.lng.toFixed(3)}</p>
          </div>
        )}
      </div>
      <div className="order-tracking-footer">
        {deliveryBoy && <button className="nav-button">Navigate</button>}
      </div>
    </div>
  );
};

export default OrderTrackingPanel;
