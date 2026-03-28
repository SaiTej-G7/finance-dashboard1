
import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import "../styles/transactiontable.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";


function TransactionTable({ transactions = [], onEdit }) {
const { addNotification } = useNotifications();

const largeTxnAlert = JSON.parse(localStorage.getItem("largeTxnAlert") || "true");

if (largeTxnAlert && transactions.amount > 5000) {
  addNotification("⚠️ Large transaction detected","warning");
}

const { deleteTransaction } = useFinance();

const [sortField,setSortField] = useState("date");
const [sortOrder,setSortOrder] = useState("desc");
const [page,setPage] = useState(1);
const [expandedMonth,setExpandedMonth] = useState(null);

const rowsPerPage = 7;

/* ===============================
SORTING
================================ */

const sortedTransactions=[...transactions].sort((a,b)=>{

if(sortField==="amount"){
return sortOrder==="asc"
? Number(a.amount)-Number(b.amount)
: Number(b.amount)-Number(a.amount);
}

if(sortField==="date"){
return sortOrder==="asc"
? new Date(a.date)-new Date(b.date)
: new Date(b.date)-new Date(a.date);
}

return 0;

});

/* ===============================
GROUP BY MONTH
================================ */

const monthMap = {};
const year = new Date().getFullYear();

sortedTransactions.forEach(t=>{
const date = new Date(t.date);
const monthKey = date.toLocaleString("default",{month:"short",year:"numeric"});

if(!monthMap[monthKey]){
monthMap[monthKey] = [];
}

monthMap[monthKey].push(t);
});

/* INCLUDE ONLY PAST + CURRENT MONTHS */

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentMonthIndex = new Date().getMonth();

months.forEach((m,index)=>{

if(index <= currentMonthIndex){

const key = `${m} ${year}`;

if(!monthMap[key]){
monthMap[key] = [];
}

}

});

/* ===============================
BUILD GROUP DATA
================================ */

let grouped = Object.entries(monthMap).map(([month,txns])=>{

const uniqueDays = new Set(
txns.map(t=>new Date(t.date).getDate())
);

const totalExpense = txns
.filter(t=>t.type==="expense")
.reduce((a,b)=>a+Number(b.amount),0);

const totalIncome = txns
.filter(t=>t.type==="income")
.reduce((a,b)=>a+Number(b.amount),0);

return {
month,
txns,
count: txns.length,
days: uniqueDays.size,
expense: totalExpense,
income: totalIncome,
isGrouped: uniqueDays.size > 10 || txns.length === 0
};

});

/* ===============================
SAFE MONTH SORTING
================================ */

const monthIndexMap = {
Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,
Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11
};

grouped.sort((a,b)=>{
const [mA,yA] = a.month.split(" ");
const [mB,yB] = b.month.split(" ");

return (
Number(yB)*12 + monthIndexMap[mB]
-
(Number(yA)*12 + monthIndexMap[mA])
);
});

/* ===============================
PAGINATION
================================ */

const totalPages = Math.ceil(grouped.length / rowsPerPage);
const start = (page-1)*rowsPerPage;
const currentGroups = grouped.slice(start,start+rowsPerPage);

/* ===============================
DELETE
================================ */

const handleDelete=(id)=>{
if(window.confirm("Delete this transaction?")){
deleteTransaction(id);
}
};

return(

<div className="table-card">

<div className="table-header">

<h3>Transaction History</h3>

<div className="table-sort">

<select value={sortField} onChange={(e)=>setSortField(e.target.value)}>
<option value="date">Sort by Date</option>
<option value="amount">Sort by Amount</option>
</select>

<select value={sortOrder} onChange={(e)=>setSortOrder(e.target.value)}>
<option value="desc">Descending</option>
<option value="asc">Ascending</option>
</select>

</div>

</div>

<table className="transactions-table">

<thead>
<tr>
<th>Date / Month</th>
<th>Type/Info</th>
<th>Category</th>
<th>Subcategory</th>
<th>Amount</th>
<th>Payment</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{currentGroups.map(group=>{

/* ===== GROUPED ROW ===== */

if(group.isGrouped){

return(

<>
<tr
className="month-row"
onClick={()=>setExpandedMonth(
expandedMonth===group.month ? null : group.month
)}
>

<td>
{expandedMonth===group.month ? "▼" : "▶"} {group.month}
</td>

<td>{group.count} Txns</td>

<td>Expense ₹{group.expense}</td>

<td>Income ₹{group.income}</td>

<td>Balance ₹{group.income-group.expense} </td>


</tr>

 {/* ===== EXPANDED ===== 

 */}

{expandedMonth===group.month && group.txns.map(t=>(

<tr key={t.id} className="sub-row">

<td>{t.date}</td>

<td>{t.type}</td>

<td>{t.category}</td>
<td>{t.subcategory}</td>
<td className={t.type==="income"?"income":"expense"}>
₹{t.amount}
</td>

<td>{t.paymentMethod}</td>
<td>
<button className="edit-btn" onClick={()=>onEdit && onEdit(t)}>
<FaEdit/> Edit
</button>

<button className="delete-btn" onClick={()=>handleDelete(t.id)}>
<FaTrash/> Delete
</button>
</td>

</tr>

))}

</>

);

}

/* ===== NORMAL ROWS ===== */

return group.txns.map(t=>(

<tr key={t.id}>

<td>{t.date}</td>
<td>{t.type}</td>
<td>{t.category}</td>
<td>{t.subcategory}</td>
<td className={t.type==="income"?"income":"expense"}>
₹{t.amount}
</td>
<td>{t.paymentMethod}</td>

<td className="actions">

<button className="edit-btn" onClick={()=>onEdit && onEdit(t)}>
<FaEdit/> Edit
</button>

<button className="delete-btn" onClick={()=>handleDelete(t.id)}>
<FaTrash/> Delete
</button>

</td>

</tr>

));

})}

</tbody>

</table>

<div className="pagination">

<button disabled={page===1} onClick={()=>setPage(page-1)}>Prev</button>

<span>Page {page} of {totalPages || 1}</span>

<button disabled={page===totalPages} onClick={()=>setPage(page+1)}>Next</button>

</div>

</div>

);

}

export default TransactionTable;