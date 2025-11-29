document.getElementById("loadDataBtn").addEventListener("click", async () => {
  const resultEl = document.getElementById("result");
  resultEl.textContent = "Loading...";

  try {
    const res = await fetch("https://product-service-team1.onrender.com/product");
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();
    resultEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    resultEl.textContent = "Error: " + err.message;
  }
});