(function () {
    const css = `
      .appointment-widget-container {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 20px auto;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .appointment-widget-container h2 {
        text-align: center;
      }
      .appointment-widget-container input,
      .appointment-widget-container select,
      .appointment-widget-container button {
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        font-size: 16px;
      }
      .appointment-widget-container button {
        background: #28a745;
        color: white;
        border: none;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      .appointment-widget-container button:hover {
        background: #218838;
      }
      .appointment-widget-container table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
        font-size: 14px;
      }
      .appointment-widget-container th,
      .appointment-widget-container td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        text-align: left;
      }
      .appointment-widget-container .action-buttons {
        display: flex;
        gap: 5px;
      }
      .appointment-widget-container .delete {
        background: #dc3545;
      }
      .appointment-widget-container .edit {
        background: #fd7e14;
      }
    `;
  
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  
    const container = document.createElement("div");
    container.className = "appointment-widget-container";
    container.innerHTML = `
      <h2>Book Appointment</h2>
      <input id="appt-name" type="text" placeholder="Name" />
      <input id="appt-phone" type="text" placeholder="Phone Number" />
      <input id="appt-date" type="date" />
      <select id="appt-slot"></select>
      <button id="appt-submit">Book Appointment</button>
      <table>
        <thead>
          <tr><th>Name</th><th>Phone</th><th>Date</th><th>Slot</th><th>Actions</th></tr>
        </thead>
        <tbody id="appt-table"></tbody>
      </table>
    `;
    document.body.appendChild(container);
  
    const nameInput = container.querySelector("#appt-name");
    const phoneInput = container.querySelector("#appt-phone");
    const dateInput = container.querySelector("#appt-date");
    const slotSelect = container.querySelector("#appt-slot");
    const submitBtn = container.querySelector("#appt-submit");
    const tableBody = container.querySelector("#appt-table");
  
    function generateSlots() {
      const start = 10;
      const end = 17;
      slotSelect.innerHTML = "";
      for (let h = start; h < end; h++) {
        for (let m = 0; m < 60; m += 30) {
          const hour = h.toString().padStart(2, "0");
          const minute = m.toString().padStart(2, "0");
          const slot = `${hour}:${minute}`;
          if (slot >= "13:00" && slot < "14:00") continue;
          const option = document.createElement("option");
          option.value = slot;
          option.textContent = slot;
          slotSelect.appendChild(option);
        }
      }
    }
  
    function fetchAppointments() {
      fetch("http://localhost:5002/api/appointments")
        .then(res => res.json())
        .then(data => {
          tableBody.innerHTML = "";
          data.forEach(appt => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${appt.name}</td>
              <td>${appt.phone}</td>
              <td>${appt.date}</td>
              <td>${appt.time_slot}</td>
              <td class="action-buttons">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
              </td>
            `;
  
            tr.querySelector(".edit").onclick = () => {
              nameInput.value = appt.name;
              phoneInput.value = appt.phone;
              dateInput.value = appt.date;
              slotSelect.value = appt.time_slot;
              submitBtn.textContent = "Update Appointment";
              submitBtn.dataset.id = appt.id;
            };
  
            tr.querySelector(".delete").onclick = () => {
              fetch(`http://localhost:5002/api/appointments/${appt.id}`, { method: "DELETE" })
                .then(() => fetchAppointments());
            };
  
            tableBody.appendChild(tr);
          });
        });
    }
  
    submitBtn.onclick = () => {
      const payload = {
        name: nameInput.value,
        phone: phoneInput.value,
        date: dateInput.value,
        time_slot: slotSelect.value
      };
      const id = submitBtn.dataset.id;
  
      if (id) {
        fetch(`http://localhost:5002/api/appointments/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(() => {
          submitBtn.textContent = "Book Appointment";
          delete submitBtn.dataset.id;
          fetchAppointments();
        });
      } else {
        fetch("http://localhost:5002/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(res => res.json()).then(result => {
          if (result.success) {
            fetchAppointments();
          } else {
            alert(result.message);
          }
        });
      }
    };
  
    generateSlots();
    fetchAppointments();
  })();
  