const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const currentPageDisplay = document.getElementById("currentPage");
const totalRows = 0;
let currentPage = 1;
let totalPages;
let current_sort = 'none'
let basic_key = 'none'
let status_key = 'none'
let size_map = {};
const tableBody = document.getElementById("data-body");
let isAscending = true


prevButton.addEventListener("click", () => {
   if (currentPage > 1) {
      currentPage--;
      updateTable(true);
   }
});

nextButton.addEventListener("click", () => {
   currentPage++;
   updateTable(true);
});

function resetSortIndicators() {
   let table_ = document.getElementById("data-table");
   let headers = table_.querySelectorAll("span[data-column]");
   headers.forEach(header => {
      header.classList.remove("asc", "desc");
   });
}

function updateTable(next_page_or_filter) {
   if (!next_page_or_filter) {
      let spanElement;
      if (current_sort != 'none') {
         spanElement = document.querySelector(`span[data-column="${current_sort}"]`);
         isAscending = !spanElement.classList.contains("asc");
         resetSortIndicators();
         spanElement.classList.toggle("asc", isAscending);
         spanElement.classList.toggle("desc", !isAscending);
      } else {
         resetSortIndicators();
      }
   }

   tableBody.innerHTML = '';
   const apiUrl = 'http://127.0.0.1:8080/inspections';
   const params = {
      page_no: currentPage,
      sort_term: current_sort,
      basic_key: basic_key,
      status_key: status_key,
      is_ascending: isAscending
   };
   const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
   const fullUrl = `${apiUrl}?${queryString}`;
   loader.style.display = "block";
   fetch(fullUrl)
      .then(response => response.json())
      .then(res => {
         data = res.data
         data.forEach(item => {
            const row = document.createElement("tr");
            const date = document.createElement("td");
            const status = document.createElement("td");
            const inspection_no = document.createElement("td");
            const vehicle_plate = document.createElement("td");
            const basic = document.createElement("td");
            const weight = document.createElement("td");
            const report_state = document.createElement("td");
            const state = document.createElement("td");
            const type = document.createElement("td");
            date.textContent = item.date;
            status.textContent = item.status;
            inspection_no.textContent = item.inspection_no;
            vehicle_plate.textContent = item.vehicle_plate;
            basic.textContent = item.BASIC;
            weight.textContent = item.weight;
            report_state.textContent = item.report_state;
            state.textContent = item.state;
            type.textContent = item.type_;
            if (status.textContent === "No violation") {
               status.className = "status-success";
            } else if (status.textContent === "Resolved") {
               status.className = "status-neutral";
            } else {
               status.className = "status-failure";
            }

            row.appendChild(date)
            row.appendChild(inspection_no)
            row.appendChild(report_state)
            row.appendChild(vehicle_plate)
            row.appendChild(state)
            row.appendChild(type)
            row.appendChild(weight)
            row.appendChild(status)
            row.appendChild(basic)
            row.addEventListener("click", () => {
               const newPageUrl = `inspection.html?inspection_no=${item.inspection_no}`;
               window.location.href = newPageUrl;
            });

            tableBody.appendChild(row);

         });
         totalPages = res.size;
         currentPageDisplay.textContent = `Page ${currentPage} / ${totalPages}`;
         loader.style.display = "none";
      })
      .catch(error => {
         console.error("Error fetching data:", error);
      });

}

function updateInspectionView(inspection_no) {
   const tableVehicle = document.getElementById("data-table-vehicle");
   tableBody.innerHTML = '';
   const apiUrl = 'http://127.0.0.1:8080/inspection_detail';
   const params = {
      inspection_no: currentPage,
   };
   const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
   const fullUrl = `${apiUrl}?${queryString}`;
   fetch(fullUrl)
      .then(response => response.json())
      .then(res => {
         data = res.data
         data.forEach(item => {
            const row = document.createElement("tr");
            const unit = document.createElement("td");
            const type = document.createElement("td");
            const plate = document.createElement("td");
            const state = document.createElement("td");
            const vin = document.createElement("td");

            unit.textContent = item.unit;
            type.textContent = item.type;
            plate.textContent = item.plate;
            vin.textContent = item.vin;
            state.textContent = item.state;

            row.appendChild(unit)
            row.appendChild(type)
            row.appendChild(plate)
            row.appendChild(vin)
            row.appendChild(state)

            tableBody.appendChild(row);

         });
      })
      .catch(error => {
         console.error("Error fetching data:", error);
      });

}

function sortTable(sort_term) {
   currentPage = 1;
   current_sort = sort_term
   updateTable(false);

}

function setBasicFilterOption() {
   const dropdown = document.getElementById("basic-filter");
   fetch("http://127.0.0.1:8080/basic_keys")
      .then(response => response.json())
      .then(data => {
         data.forEach(user => {
            const option = document.createElement("option");
            option.value = user;
            option.text = user;
            dropdown.appendChild(option);
         });
      })
      .catch(error => {
         console.error("Error fetching data:", error);
         dropdown.innerHTML = "";
      });

}

document.addEventListener("DOMContentLoaded", () => {
   updateTable(true);
   setBasicFilterOption();


});

function applyFilter() {
   basic_key = document.getElementById("basic-filter").value;
   status_key = document.getElementById("basic-filter-2").value;
   currentPage = 1;
   updateTable(true);
}

function clearFilter() {
   basic_key = 'none';
   status_key = 'none';
   currentPage = 1;
   updateTable(true);
}