const donorForm = document.querySelector("#donor-form");
const donorList = document.querySelector("#donor-list");
const stats = document.querySelector("#stats");
const filterForm = document.querySelector("#filter-form");
const requestForm = document.querySelector("#request-form");
const requestList = document.querySelector("#request-list");
const compatibilityBox = document.querySelector("#compatibility");

const compatibility = {
  "A+": ["A+", "AB+"],
  "A-": ["A+", "A-", "AB+", "AB-"],
  "B+": ["B+", "AB+"],
  "B-": ["B+", "B-", "AB+", "AB-"],
  "AB+": ["AB+"],
  "AB-": ["AB+", "AB-"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "O-": ["Everyone"]
};

const starterDonors = [
  { id: crypto.randomUUID(), name: "Emma Reed", phone: "+1 555 341 887", city: "New York", bloodGroup: "O+", lastDonation: "2025-01-14", availability: "Available", notes: "Can travel within city" },
  { id: crypto.randomUUID(), name: "Liam Carter", phone: "+1 555 102 765", city: "Boston", bloodGroup: "A-", lastDonation: "2024-12-08", availability: "Busy today", notes: "Available after 6 PM" },
  { id: crypto.randomUUID(), name: "Sophia Khan", phone: "+1 555 803 290", city: "Chicago", bloodGroup: "B+", lastDonation: "2025-02-11", availability: "Available", notes: "Preferred hospital donation" }
];

const storage = {
  getDonors() {
    const raw = localStorage.getItem("lifelink-donors");
    if (!raw) {
      localStorage.setItem("lifelink-donors", JSON.stringify(starterDonors));
      return starterDonors;
    }
    return JSON.parse(raw);
  },
  setDonors(list) {
    localStorage.setItem("lifelink-donors", JSON.stringify(list));
  },
  getRequests() {
    return JSON.parse(localStorage.getItem("lifelink-requests") || "[]");
  },
  setRequests(list) {
    localStorage.setItem("lifelink-requests", JSON.stringify(list));
  }
};

function daysSince(dateString) {
  if (!dateString) return "No record";
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
  return `${days} day(s) ago`;
}

function renderStats(donors) {
  const available = donors.filter((d) => d.availability === "Available").length;
  const urgent = storage.getRequests().length;
  stats.innerHTML = `
    <span class="stat">Total Donors: ${donors.length}</span>
    <span class="stat">Available Now: ${available}</span>
    <span class="stat">Open Requests: ${urgent}</span>
  `;
}

function donorCard(donor) {
  return `
  <article class="item">
    <h3>${donor.name} <span class="badge">${donor.bloodGroup}</span></h3>
    <p><strong>City:</strong> ${donor.city}</p>
    <p><strong>Phone:</strong> ${donor.phone}</p>
    <p><strong>Availability:</strong> ${donor.availability}</p>
    <p><strong>Last Donation:</strong> ${daysSince(donor.lastDonation)}</p>
    <p><strong>Notes:</strong> ${donor.notes || "-"}</p>
  </article>`;
}

function requestCard(req) {
  return `
  <article class="item">
    <h3>${req.patientName} <span class="badge">Needs ${req.requiredGroup}</span></h3>
    <p><strong>Hospital:</strong> ${req.hospital}</p>
    <p><strong>City:</strong> ${req.city}</p>
    <p><strong>Contact:</strong> ${req.contact}</p>
    <p><strong>Created:</strong> ${new Date(req.createdAt).toLocaleString("en-US")}</p>
  </article>`;
}

function renderCompatibility() {
  compatibilityBox.innerHTML = Object.entries(compatibility)
    .map(([group, accepts]) => `<div><strong>${group}</strong><br/>Can donate to: ${accepts.join(", ")}</div>`)
    .join("");
}

function readFilters() {
  return {
    search: document.querySelector("#search-name").value.trim().toLowerCase(),
    group: document.querySelector("#filter-group").value,
    city: document.querySelector("#filter-city").value.trim().toLowerCase(),
    availability: document.querySelector("#filter-availability").value
  };
}

function renderDonors() {
  const donors = storage.getDonors();
  const { search, group, city, availability } = readFilters();
  const filtered = donors.filter((d) => {
    const okSearch = !search || d.name.toLowerCase().includes(search);
    const okGroup = !group || d.bloodGroup === group;
    const okCity = !city || d.city.toLowerCase().includes(city);
    const okAvailability = !availability || d.availability === availability;
    return okSearch && okGroup && okCity && okAvailability;
  });

  donorList.innerHTML = filtered.length
    ? filtered.map(donorCard).join("")
    : `<p class="small">No donor found for selected filters.</p>`;

  renderStats(donors);
}

function renderRequests() {
  const requests = storage.getRequests().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  requestList.innerHTML = requests.length
    ? requests.map(requestCard).join("")
    : `<p class="small">No active requests yet.</p>`;
}

donorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(donorForm);
  const nextDonor = {
    id: crypto.randomUUID(),
    name: form.get("name").toString().trim(),
    phone: form.get("phone").toString().trim(),
    city: form.get("city").toString().trim(),
    bloodGroup: form.get("bloodGroup").toString(),
    lastDonation: form.get("lastDonation").toString(),
    availability: form.get("availability").toString(),
    notes: form.get("notes").toString().trim()
  };

  const donors = storage.getDonors();
  donors.unshift(nextDonor);
  storage.setDonors(donors);
  donorForm.reset();
  renderDonors();
});

filterForm.addEventListener("input", renderDonors);
document.querySelector("#reset-filters").addEventListener("click", () => {
  filterForm.reset();
  renderDonors();
});

requestForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(requestForm);
  const nextRequest = {
    id: crypto.randomUUID(),
    patientName: form.get("patientName").toString().trim(),
    requiredGroup: form.get("requiredGroup").toString(),
    hospital: form.get("hospital").toString().trim(),
    city: form.get("city").toString().trim(),
    contact: form.get("contact").toString().trim(),
    createdAt: new Date().toISOString()
  };
  const requests = storage.getRequests();
  requests.push(nextRequest);
  storage.setRequests(requests);
  requestForm.reset();
  renderRequests();
  renderDonors();
});

renderCompatibility();
renderDonors();
renderRequests();
