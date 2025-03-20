document.addEventListener("DOMContentLoaded", async function () {
    try {
        console.log("Sending request to: http://localhost:5000/register");

        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "John", email: "john@example.com", password: "123456" })
        });

        const data = await response.json();
        console.log("Server Response:", data);

    } catch (error) {
        console.error("Fetch error:", error);
    }
});
