async function loadSlots() {
    const date = document.getElementById("date").value;
    const slotSelect = document.getElementById("timeSlot");
    if (!date) return;

    const res = await fetch(`/api/slots?date=${date}`);
    const slots = await res.json();

    slotSelect.innerHTML = "<option value=''>Select Time Slot</option>";
    slots.forEach(slot => {
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = slot;
        slotSelect.appendChild(option);
    });
}

document.getElementById("date").addEventListener("change", loadSlots);

document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
        name: form.name.value,
        phone: form.phone.value,
        date: form.date.value,
        time_slot: form.timeSlot.value
    };

    const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    document.getElementById("status").textContent = result.message;
    if (result.success) {
        form.reset();
        loadSlots();
        loadAppointments();
    }
});

async function loadAppointments() {
    const res = await fetch("/api/appointments");
    const data = await res.json();
    const tbody = document.querySelector("#appointmentsTable tbody");
    tbody.innerHTML = "";

    data.forEach(app => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${app.name}</td>
            <td>${app.phone}</td>
            <td>${app.date}</td>
            <td>${app.time_slot}</td>
            <td>
                <button class="edit" onclick="editAppointment(${app.id}, '${app.name}', '${app.phone}', '${app.date}', '${app.time_slot}')">Edit</button>
                <button class="delete" onclick="deleteAppointment(${app.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteAppointment(id) {
    if (!confirm("Delete this appointment?")) return;

    const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE"
    });
    const result = await res.json();
    alert(result.message);
    loadAppointments();
}

function editAppointment(id, name, phone, date, time) {
    document.getElementById("name").value = name;
    document.getElementById("phone").value = phone;
    document.getElementById("date").value = date;

    loadSlots().then(() => {
        document.getElementById("timeSlot").value = time;
    });

    const form = document.getElementById("appointmentForm");
    form.removeEventListener("submit", submitHandler);
    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: form.name.value,
            phone: form.phone.value,
            date: form.date.value,
            time_slot: form.timeSlot.value
        };
        const res = await fetch(`/api/appointments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        document.getElementById("status").textContent = result.message;
        form.reset();
        loadAppointments();
        form.onsubmit = submitHandler;
    };
}

const submitHandler = document.getElementById("appointmentForm").onsubmit;
loadAppointments();
