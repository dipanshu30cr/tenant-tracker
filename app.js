const { Client, Databases, ID, Query } = Appwrite;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('69ebaa44001029b8e4a3');

const db = new Databases(client);

const DB_ID = "69ebaa660031f8120f2d";
const COL_ID = "payments";

// VALIDATION FUNCTION
function validate() {
  const flatVal = flat.value.trim();
  const nameVal = name.value.trim();
  const amountVal = amount.value.trim();
  const monthVal = month.value.trim();
  const yearVal = year.value.trim();

  if (!flatVal || !nameVal || !amountVal || !monthVal || !yearVal) {
    return "All fields are required";
  }

  if (!/^[a-zA-Z ]+$/.test(nameVal)) {
    return "Name should contain only letters";
  }

  if (!/^[0-9]+$/.test(yearVal)) {
    return "Year must be numeric";
  }

  if (yearVal.length !== 4) {
    return "Year must be 4 digits";
  }

  if (amountVal <= 0) {
    return "Amount must be greater than 0";
  }

  return "";
}

// ADD DATA
async function addData() {
  const error = validate();
  if (error) {
    errorMsg.innerText = error;
    return;
  }

  errorMsg.innerText = "";

  try {
    await db.createDocument(DB_ID, COL_ID, ID.unique(), {
      flatNo: flat.value,
      name: name.value,
      amount: parseInt(amount.value),
      month: month.value,
      year: year.value
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