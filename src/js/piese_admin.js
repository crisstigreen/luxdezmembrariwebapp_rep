


//PAGE LOAD 
document.addEventListener('DOMContentLoaded', async () => {
    debugger;
    await initializePage();

    await generateDynamicMenu();
});










async function initializePage() {
      debugger;

    if (sessionStorage.getItem('email') == null || sessionStorage.getItem('role') == "2") {
        window.location = '../index.html';
        return;
    }   
    
  
    await pieseApiCall(populateMainGrid); // Refresh grid

    // Reatașează evenimentele dacă trebuie (optional, vezi mai jos)
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('page-size').addEventListener('change', () => changePageSize());
    document.getElementById('order_term').addEventListener('change', () => changeOrderBy());

    fetch('/admin/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-placeholder').innerHTML = data;
        });
}



async function get_details(id) {
    debugger;    
    if (id) {
        const url = `piese_add.html?id=${id}`;
        window.location = url;

    } else {
        
    }
}

//buton adauga
document.getElementById('adaugaBtn').addEventListener('click', function () { 
    debugger;       
    const url = `piese_add.html`;
    window.location=url;
});


//**********  cautare ********************************************************************* */

document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    pieseApiCall(populateMainGrid); // Apelează funcția de căutare
});

function filterMainGrid(){
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    pieseApiCall(populateMainGrid); // Apelează funcția de căutare
}

document.getElementById('exportBtn').addEventListener('click', async () => {
    debugger; 

       // Afișează loaderul
       Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    const tip = document.getElementById('export_type').value; 
    
    const link = `${API_BASE_URL}/Piese/export?tip=${tip}`;

    // Apelează funcția pentru descărcare
    await downloadFile(link);

    Swal.close(); 

});

async function downloadFile(link) {
    try {
        const response = await fetch(link, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Creează un Blob din răspuns
        const blob = await response.blob();

        // Creează un link temporar pentru descărcare
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Setează numele fișierului descărcat
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
            ? contentDisposition.split('filename=')[1]?.replace(/["']/g, '') || 'file'
            : 'file';
        a.download = filename;

        // Adaugă linkul temporar în DOM și declanșează descărcarea
        document.body.appendChild(a);
        a.click();

        // Curăță resursele temporare
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('A apărut o eroare la descărcarea fișierului:', error);
    }
}



document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        pieseApiCall(populateMainGrid); // Apelează funcția de căutare
    }
});

function logout(){
    debugger;
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
}


// Funcție pentru gestionarea evenimentului pageshow
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});




