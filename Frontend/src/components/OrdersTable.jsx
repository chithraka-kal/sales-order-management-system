import React from 'react';

export const OrdersTable = ({ orders, onRowClick }) => (
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
          <tr><td colSpan="6" className="p-6 text-center text-gray-500">No orders found.</td></tr>
        ) : (
          orders.map((order) => (
            <tr 
              key={order.id} 
              className="border-b hover:bg-gray-50 cursor-pointer transition"
              onDoubleClick={() => onRowClick(order.id)}
            >
              <td className="p-4">{order.invoiceNo}</td>
              <td className="p-4">{new Date(order.invoiceDate).toLocaleDateString()}</td>
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
);