function getReservations() {
  return JSON.parse(localStorage.getItem("gregsReservations")) || [];
}

function saveReservations(reservations) {
  localStorage.setItem("gregsReservations", JSON.stringify(reservations));
}

function renderReservations() {
  const reservations = getReservations();
  const rows = document.getElementById("reservationRows");
  const emptyMessage = document.getElementById("emptyMessage");

  if (reservations.length === 0) {
    rows.innerHTML = "";
    emptyMessage.textContent = "No reservations yet.";
    return;
  }

  emptyMessage.textContent = "";

  rows.innerHTML = reservations.map(reservation => `
    <tr>
      <td>${reservation.name}</td>
      <td>${reservation.email}</td>
      <td>${reservation.date}</td>
      <td>${reservation.time}</td>
      <td>${reservation.partySize}</td>
      <td>${reservation.status}</td>
      <td>${reservation.createdAt}</td>
      <td>
        <button onclick="confirmReservation(${reservation.id})">Confirm</button>
        <button onclick="deleteReservation(${reservation.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function confirmReservation(id) {
  const reservations = getReservations().map(reservation => {
    if (reservation.id === id) {
      return { ...reservation, status: "Confirmed" };
    }
    return reservation;
  });

  saveReservations(reservations);
  renderReservations();
}

function deleteReservation(id) {
  const reservations = getReservations().filter(reservation => reservation.id !== id);
  saveReservations(reservations);
  renderReservations();
}

function clearReservations() {
  const confirmed = confirm("Are you sure you want to clear all reservations?");
  if (!confirmed) return;

  localStorage.removeItem("gregsReservations");
  renderReservations();
}

function exportReservations() {
  const reservations = getReservations();

  if (reservations.length === 0) {
    alert("No reservations to export.");
    return;
  }

  const headers = ["Name", "Email", "Date", "Time", "Party Size", "Status", "Submitted"];
  const rows = reservations.map(r => [
    r.name,
    r.email,
    r.date,
    r.time,
    r.partySize,
    r.status,
    r.createdAt
  ]);

  const csv = [
    headers.join(","),
    ...rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "gregs-reservations.csv";
  link.click();

  URL.revokeObjectURL(url);
}

renderReservations();
