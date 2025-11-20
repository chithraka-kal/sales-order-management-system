import React, { useState, useEffect } from "react";
import { LabelInput, LabelSelect } from "../components/FormElements";
import { useNavigate } from "react-router-dom";

// --- MOCK DATA (Until Backend is ready) ---
const DUMMY_CUSTOMERS = [
  { id: 1, name: "Tech Sol", address1: "123 Main St", address2: "Suite 100", city: "Colombo" },
  { id: 2, name: "Alpha Ind", address1: "45 Industrial Rd", address2: "Warehouse B", city: "Kandy" },
];

const DUMMY_ITEMS = [
  { code: "ITM001", description: "Laptop Dell", price: 150000 },
  { code: "ITM002", description: "Mouse Wireless", price: 2500 },
  { code: "ITM003", description: "Keyboard Mech", price: 8000 },
];

export default function SalesOrder() {
  const navigate = useNavigate();

  // --- STATE ---
  // Header Data
  const [customer, setCustomer] = useState({ id: "", name: "", address1: "", address2: "", city: "" });
  const [invoiceData, setInvoiceData] = useState({ no: "INV-001", date: new Date().toISOString().split('T')[0] });
  
  // Grid Data
  const [rows, setRows] = useState([]);

  // --- CALCULATIONS [cite: 97-99] ---
  const calculateLine = (row) => {
    const qty = parseFloat(row.qty) || 0;
    const price = parseFloat(row.price) || 0;
    const taxRate = parseFloat(row.taxRate) || 0;

    const exclAmount = qty * price;               // 1. Excl Amount = Quantity * Price
    const taxAmount = exclAmount * (taxRate / 100); // 2. Tax Amount
    const inclAmount = exclAmount + taxAmount;    // 3. Incl Amount

    return { ...row, exclAmount, taxAmount, inclAmount };
  };

  // --- HANDLERS ---

  // 1. Auto-fill Address 
  const handleCustomerChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedCust = DUMMY_CUSTOMERS.find(c => c.id === selectedId);
    
    if (selectedCust) {
      setCustomer(selectedCust);
    } else {
      setCustomer({ id: "", name: "", address1: "", address2: "", city: "" });
    }
  };

  // 2. Add New Row
  const addRow = () => {
    setRows([...rows, { 
      id: Date.now(), itemCode: "", description: "", note: "", 
      qty: 0, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0 
    }]);
  };

  // 3. Handle Row Changes (Complex Logic)
  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    let currentRow = { ...newRows[index], [field]: value };

    // Item Sync Logic[cite: 94]: If Code changes, update Desc & Price (and vice versa)
    if (field === "itemCode" || field === "description") {
      const item = DUMMY_ITEMS.find(i => i.code === value || i.description === value);
      if (item) {
        currentRow.itemCode = item.code;
        currentRow.description = item.description;
        currentRow.price = item.price;
      }
    }

    // Re-calculate totals for this line
    currentRow = calculateLine(currentRow);
    newRows[index] = currentRow;
    setRows(newRows);
  };

  // 4. Calculate Grand Totals [cite: 85-88]
  const grandTotalExcl = rows.reduce((sum, r) => sum + r.exclAmount, 0);
  const grandTotalTax = rows.reduce((sum, r) => sum + r.taxAmount, 0);
  const grandTotalIncl = rows.reduce((sum, r) => sum + r.inclAmount, 0);

  const handleSave = () => {
    console.log("Saving Order:", { customer, rows, totals: { grandTotalExcl, grandTotalIncl } });
    alert("Order Saved (Check Console)");
    navigate("/"); // Go back to Home
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg mt-10 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Sales Order</h1>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow">
          Save Order
        </button>
      </div>

      {/* Form Section 1: Customer & Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        
        {/* Left: Customer Details [cite: 67-74] */}
        <div className="space-y-3 border p-4 rounded bg-gray-50">
          <LabelSelect 
            label="Customer Name" 
            name="customer"
            value={customer.id}
            onChange={handleCustomerChange}
            options={DUMMY_CUSTOMERS.map(c => ({ value: c.id, label: c.name }))}
          />
          <LabelInput label="Address 1" value={customer.address1} onChange={(e) => setCustomer({...customer, address1: e.target.value})} />
          <LabelInput label="Address 2" value={customer.address2} onChange={(e) => setCustomer({...customer, address2: e.target.value})} />
          <LabelInput label="City/State" value={customer.city} onChange={(e) => setCustomer({...customer, city: e.target.value})} />
        </div>

        {/* Right: Invoice Details [cite: 77-79] */}
        <div className="space-y-3 border p-4 rounded bg-gray-50">
          <LabelInput label="Invoice No" value={invoiceData.no} readOnly />
          <LabelInput label="Invoice Date" type="date" value={invoiceData.date} onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})} />
        </div>
      </div>

      {/* Grid Section [cite: 81-84] */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 w-24">Item Code</th>
              <th className="border p-2 w-48">Description</th>
              <th className="border p-2">Note</th>
              <th className="border p-2 w-20">Qty</th>
              <th className="border p-2 w-24">Price</th>
              <th className="border p-2 w-20">Tax %</th>
              <th className="border p-2 w-24 bg-gray-100">Excl Amt</th>
              <th className="border p-2 w-24 bg-gray-100">Tax Amt</th>
              <th className="border p-2 w-24 bg-gray-100">Incl Amt</th>
              <th className="border p-2 w-10">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border p-1">
                  <select 
                    className="w-full p-1 border rounded"
                    value={row.itemCode}
                    onChange={(e) => handleRowChange(index, "itemCode", e.target.value)}
                  >
                    <option value="">Select</option>
                    {DUMMY_ITEMS.map(i => <option key={i.code} value={i.code}>{i.code}</option>)}
                  </select>
                </td>
                <td className="border p-1">
                  <select 
                    className="w-full p-1 border rounded"
                    value={row.description}
                    onChange={(e) => handleRowChange(index, "description", e.target.value)}
                  >
                    <option value="">Select</option>
                    {DUMMY_ITEMS.map(i => <option key={i.code} value={i.description}>{i.description}</option>)}
                  </select>
                </td>
                <td className="border p-1"><input className="w-full p-1 outline-none" value={row.note} onChange={(e) => handleRowChange(index, "note", e.target.value)} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 outline-none text-right" value={row.qty} onChange={(e) => handleRowChange(index, "qty", e.target.value)} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 outline-none text-right" value={row.price} readOnly /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 outline-none text-right" value={row.taxRate} onChange={(e) => handleRowChange(index, "taxRate", e.target.value)} /></td>
                
                {/* Read Only Calculated Fields */}
                <td className="border p-1 bg-gray-50 text-right">{row.exclAmount.toFixed(2)}</td>
                <td className="border p-1 bg-gray-50 text-right">{row.taxAmount.toFixed(2)}</td>
                <td className="border p-1 bg-gray-50 text-right font-bold">{row.inclAmount.toFixed(2)}</td>
                
                <td className="border p-1 text-center">
                   <button onClick={() => setRows(rows.filter((_, i) => i !== index))} className="text-red-500 font-bold">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm">+ Add Item</button>
      </div>

      {/* Footer Totals [cite: 85-88] */}
      <div className="flex justify-end">
        <div className="w-64 border p-4 bg-gray-50 rounded shadow-sm space-y-2">
          <div className="flex justify-between text-sm"><span>Total Excl:</span> <span>{grandTotalExcl.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Total Tax:</span> <span>{grandTotalTax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 border-gray-300">
            <span>Total Incl:</span> <span>{grandTotalIncl.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}