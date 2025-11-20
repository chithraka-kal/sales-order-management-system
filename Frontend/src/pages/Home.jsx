import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// BACKEND PORT 
const API_BASE = "http://localhost:5278/api";

export default function Home() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch orders when page loads
  useEffect(() => {
    axios.get(`${API_BASE}/sales`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sales Orders</h1>
        {/* "Add New" button*/}
        <Link to="/order" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-md">
          + Add New Order
        </Link>
      </div>

      {/* Orders Grid  */}
      <div className="bg-white shadow rounded overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Invoice No</th>
              <th className="p-4 font-semibold text-gray-700">Date</th>
              <th className="p-4 font-semibold text-gray-700">Customer</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Total Excl</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Total Tax</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Total Incl</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">No orders found. Click "Add New" to create one.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                  
                  onDoubleClick={() => navigate(`/order/${order.id}`)} 
                >
                  <td className="p-4">{order.invoiceNo}</td>
                  <td className="p-4">{new Date(order.invoiceDate).toLocaleDateString()}</td>
                  {/* Handle null customer*/}
                  <td className="p-4">{order.customer ? order.customer.name : "Unknown"}</td>
                  <td className="p-4 text-right">{order.totalExcl.toFixed(2)}</td>
                  <td className="p-4 text-right">{order.totalTax.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-green-700">{order.totalIncl.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}