import React, { useState, useEffect } from "react";
import { LabelInput, LabelSelect } from "../components/FormElements";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';


const API_BASE = "http://localhost:5278/api"; 

export default function SalesOrder() {
  const navigate = useNavigate();

  // --- STATE ---
  // 1. Store lists from Database 
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  
  const [customer, setCustomer] = useState({ id: "", name: "", address1: "", address2: "", city: "" });
  const [invoiceData, setInvoiceData] = useState({ no: "INV-" + Date.now(), date: new Date().toISOString().split('T')[0] });
  const [rows, setRows] = useState([]);

  // --- 2. FETCH DATA ON LOAD  ---
  useEffect(() => {

    axios.get(`${API_BASE}/sales/customers`)
      .then(res => setCustomers(res.data))
      .catch(err => console.error("Error loading customers", err));

    axios.get(`${API_BASE}/sales/items`)
      .then(res => setItems(res.data))
      .catch(err => console.error("Error loading items", err));
  }, []);


  const calculateLine = (row) => {
    const qty = parseFloat(row.qty) || 0;
    const price = parseFloat(row.price) || 0;
    const taxRate = parseFloat(row.taxRate) || 0;

    const exclAmount = qty * price;
    const taxAmount = exclAmount * (taxRate / 100);
    const inclAmount = exclAmount + taxAmount;

    return { ...row, exclAmount, taxAmount, inclAmount };
  };

  // --- HANDLERS ---
  const handleCustomerChange = (e) => {
    const selectedId = parseInt(e.target.value);
    // Look inside the REAL customers state
    const selectedCust = customers.find(c => c.id === selectedId);
    
    if (selectedCust) {
      setCustomer(selectedCust);
    } else {
      setCustomer({ id: "", name: "", address1: "", address2: "", city: "" });
    }
  };

  const addRow = () => {
    setRows([...rows, { 
      tempId: Date.now(), 
      itemCode: "", description: "", note: "", 
      qty: 0, price: 0, taxRate: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0 
    }]);
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    let currentRow = { ...newRows[index], [field]: value };

    // Auto-fill from REAL items state
    if (field === "itemCode" || field === "description") {
      const item = items.find(i => i.code === value || i.description === value);
      if (item) {
        currentRow.itemCode = item.code;
        currentRow.description = item.description;
        currentRow.price = item.price;
      }
    }

    currentRow = calculateLine(currentRow);
    newRows[index] = currentRow;
    setRows(newRows);
  };

  const handleSave = async () => {
    if (!customer.id) return toast.error("Please select a customer");
    if (rows.length === 0) return toast.error("Please add at least one item");

    const grandTotalExcl = rows.reduce((sum, r) => sum + r.exclAmount, 0);
    const grandTotalTax = rows.reduce((sum, r) => sum + r.taxAmount, 0);
    const grandTotalIncl = rows.reduce((sum, r) => sum + r.inclAmount, 0);

    // Create the DTO object the backend expects
    const orderPayload = {
      invoiceNo: invoiceData.no,
      invoiceDate: invoiceData.date,
      customerId: customer.id,
      totalExcl: grandTotalExcl,
      totalTax: grandTotalTax,
      totalIncl: grandTotalIncl,
      items: rows.map(r => ({
        itemCode: r.itemCode,
        description: r.description,
        note: r.note,
        qty: parseFloat(r.qty),
        price: parseFloat(r.price),
        taxRate: parseFloat(r.taxRate),
        exclAmount: r.exclAmount,
        taxAmount: r.taxAmount,
        inclAmount: r.inclAmount
      }))
    };

    try {
      await axios.post(`${API_BASE}/sales`, orderPayload);
      toast.success("Order Saved Successfully!");
      navigate("/");
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Failed to save order. Check console for errors.");
    }
  };

  // --- UI RENDER ---
  const grandTotalExcl = rows.reduce((sum, r) => sum + r.exclAmount, 0);
  const grandTotalTax = rows.reduce((sum, r) => sum + r.taxAmount, 0);
  const grandTotalIncl = rows.reduce((sum, r) => sum + r.inclAmount, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg mt-10 border border-gray-200">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Sales Order</h1>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow">
          Save Order
        </button>
      </div>

      {/* Customer Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="space-y-3 border p-4 rounded bg-gray-50">
          <LabelSelect 
            label="Customer Name" 
            name="customer"
            value={customer.id}
            onChange={handleCustomerChange}
            // Map the API data (customers state) to options
            options={customers.map(c => ({ value: c.id, label: c.name }))}
          />
          <LabelInput label="Address 1" value={customer.address1} readOnly />
          <LabelInput label="Address 2" value={customer.address2 || ""} readOnly />
          <LabelInput label="City" value={customer.city} readOnly />
        </div>
        <div className="space-y-3 border p-4 rounded bg-gray-50">
          <LabelInput label="Invoice No" value={invoiceData.no} readOnly />
          <LabelInput label="Invoice Date" type="date" value={invoiceData.date} onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})} />
        </div>
      </div>

      {/* Grid Section */}
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
              <tr key={row.tempId}>
                <td className="border p-1">
                  <select className="w-full p-1 border rounded" value={row.itemCode} onChange={(e) => handleRowChange(index, "itemCode", e.target.value)}>
                    <option value="">Select</option>
                    {/* Use 'items' state here */}
                    {items.map(i => <option key={i.code} value={i.code}>{i.code}</option>)}
                  </select>
                </td>
                <td className="border p-1">
                  <select className="w-full p-1 border rounded" value={row.description} onChange={(e) => handleRowChange(index, "description", e.target.value)}>
                    <option value="">Select</option>
                    {/* Use 'items' state here */}
                    {items.map(i => <option key={i.code} value={i.description}>{i.description}</option>)}
                  </select>
                </td>
                <td className="border p-1"><input className="w-full p-1 outline-none" value={row.note} onChange={(e) => handleRowChange(index, "note", e.target.value)} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 outline-none text-right" value={row.qty} onChange={(e) => handleRowChange(index, "qty", e.target.value)} /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 outline-none text-right" value={row.price} readOnly /></td>
                <td className="border p-1"><input type="number" className="w-full p-1 outline-none text-right" value={row.taxRate} onChange={(e) => handleRowChange(index, "taxRate", e.target.value)} /></td>
                <td className="border p-1 bg-gray-50 text-right">{row.exclAmount.toFixed(2)}</td>
                <td className="border p-1 bg-gray-50 text-right">{row.taxAmount.toFixed(2)}</td>
                <td className="border p-1 bg-gray-50 text-right font-bold">{row.inclAmount.toFixed(2)}</td>
                <td className="border p-1 text-center"><button onClick={() => setRows(rows.filter((_, i) => i !== index))} className="text-red-500 font-bold">X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm">+ Add Item</button>
      </div>

      <div className="flex justify-end">
        <div className="w-64 border p-4 bg-gray-50 rounded shadow-sm space-y-2">
          <div className="flex justify-between text-sm"><span>Total Excl:</span> <span>{grandTotalExcl.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Total Tax:</span> <span>{grandTotalTax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 border-gray-300"><span>Total Incl:</span> <span>{grandTotalIncl.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}