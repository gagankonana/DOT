function updateInspectionView(inspection_no) {
   const tableVehicle = document.getElementById("data-table-vehicle");
   const tableViolation = document.getElementById("data-table-violation");
   const apiUrl = 'http://127.0.0.1:8080/inspection_detail';
   const params = {
      inspection_no: inspection_no,
   };
   const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
   const fullUrl = `${apiUrl}?${queryString}`;
   fetch(fullUrl)
      .then(response => response.json())
      .then(res => {
         data = res.vehicle
         data.forEach(item => {
            const row = document.createElement("tr");
            const unit = document.createElement("td");
            const type = document.createElement("td");
            const plate = document.createElement("td");
            const state = document.createElement("td");
            const vin = document.createElement("td");

            unit.textContent = item.unit;
            type.textContent = item.type_;
            plate.textContent = item.vehicle_plate;
            vin.textContent = item.vin;
            state.textContent = item.state;

            row.appendChild(unit)
            row.appendChild(type)
            row.appendChild(state)
            row.appendChild(plate)
            row.appendChild(vin)

            tableVehicle.appendChild(row);

         });
         data = res.violations
         data.forEach(item => {
            const row = document.createElement("tr");
            const code = document.createElement("tr");
            const Section = document.createElement("td");
            const Unit = document.createElement("td");
            const OOS = document.createElement("td");
            const desc = document.createElement("td");
            const IN_SMS = document.createElement("td");
            const BASIC = document.createElement("td");

            code.textContent = item.code;
            Section.textContent = item.Section;
            Unit.textContent = item.unit;
            OOS.textContent = item.oos;
            desc.textContent = item.description
            IN_SMS.textContent = item.convicted_of_dif_charge;
            BASIC.textContent = item.BASIC;

            row.appendChild(code)
            row.appendChild(Section)
            row.appendChild(Unit)
            row.appendChild(OOS)
            row.appendChild(desc)
            row.appendChild(IN_SMS)
            row.appendChild(BASIC)


            tableViolation.appendChild(row);

         });
         updateValues('status', res.status)
         updateValues('report_state', res.report_state)
         updateValues('inspection_no', res.inspection_no)
         updateValues('date', res.date)
         if (res.status != "Unresolved") {
            resolve_button.disabled = true
         }
      })
      .catch(error => {
         console.error("Error fetching data:", error);
      });
}

function updateValues(id, text) {
   var element = document.getElementById(id);
   element.textContent = text
}

function getQueryParam(parameterName) {
   const urlParams = new URLSearchParams(window.location.search);
   return urlParams.get(parameterName);
}

function resolve() {
   fetch("http://127.0.0.1:8080/resolve", {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            inspection_no: inspection_no
         }),
      })
      .then((response) => response.json())
      .then((data) => {
        location.reload()

      })
      .catch((error) => {
         console.error('Error:', error);
      });
}

const backButton = document.getElementById('backButton');
const inspection_no = getQueryParam('inspection_no');
const resolve_button = document.getElementById('resolve');

resolve_button.addEventListener('click', () => {
   resolve()
});
backButton.addEventListener('click', () => {
   window.history.back();
});

document.addEventListener("DOMContentLoaded", () => {
   updateInspectionView(inspection_no);

});