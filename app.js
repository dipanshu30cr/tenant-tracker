const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('69ebaa44001029b8e4a3');

const db = new Databases(client);

const DB_ID = "69ebaa660031f8120f2d";
const COL_ID = "payments";

// VALIDATION FUNCTION
function validate() {
  const flatVal = document.getElementById("flat").value.trim();
  const nameVal = document.getElementById("name").value.trim();
  const amountVal = document.getElementById("amount").value.trim();
  const monthVal = document.getElementById("month").value.trim();
  const yearVal = document.getElementById("year").value.trim();

  if (!flatVal || !nameVal || !amountVal || !monthVal || !yearVal) {
    return "All fields are required";
  }

  if (!/^[a-zA-Z ]+$/.test(nameVal)) {
    return "Name should contain only letters";
  }

  if (!/^[0-9]+$/.test(yearVal)) {
    return "Year must be numeric";
  }

  return "";
}

// ADD DATA
async function addData() {
  const error = validate();
  if (error) {
    alert(error);
    return;
  }

  

  try {
    await db.createDocument(DB_ID, COL_ID, ID.unique(), {
        flatNo: document.getElementById("flat").value,
        name: document.getElementById("name").value,
        amount: document.getElementById("amount").value,
        month: document.getElementById("month").value,
        year: document.getElementById("year").value
        });

    alert("✅ Added successfully");

    document.querySelectorAll("input").forEach(i => i.value = "");
    loadData();

  } catch (err) {
    console.error(err);
    alert("❌ Error adding data");
  }
}

// LOAD DATA
async function loadData() {
  let queries = [];

  if (filterMonth.value)
    queries.push(Query.equal("month", filterMonth.value));

  if (filterYear.value)
    queries.push(Query.equal("year", filterYear.value));

  try {
    const res = await db.listDocuments(DB_ID, COL_ID, queries);

    let html = "";
    res.documents.forEach(d => {
      html += `<tr>
        <td>${d.flatNo}</td>
        <td>${d.name}</td>
        <td>${d.amount}</td>
        <td>${d.month}</td>
        <td>${d.year}</td>
      </tr>`;
    });

    dataTable.innerHTML = html;

  } catch (err) {
    console.error(err);
  }
}

// AUTO LOAD
loadData();