let Nivel = "";

window.topHtmlLoaded = fetch('../top.html')
    .then(response => response.text())
    .then(data => {
     
        document.body.insertAdjacentHTML('afterbegin', data);

        return new Promise(resolve => {
        
            requestAnimationFrame(() => {
          
                 var userId = sessionStorage.getItem('userId');
            
            if(userId == null)
            {
                
                
            }
            else
            {
                GetUser(userId).then(user => {                
                    var username = sessionStorage.getItem('username');

                    
                    
                    
                    
                    
                    

                    
                    var username = document.getElementById("tb_user");
                    if(username){
                        username.value = user.username;
                    }
                    var firstname = document.getElementById("tb_firstname");
                    if(firstname){
                        firstname.value = user.firstName;
                    }
                    var lastname = document.getElementById("tb_lastname");
                    if(lastname){
                        lastname.value = user.lastName;
                    }
                    var phone = document.getElementById("tb_phone");
                    if(phone){
                        phone.value = user.phoneNumber;
                    }
                    var email = document.getElementById("tb_email");
                    if(email){
                        email.value = user.email;
                    }
                    

                }).catch(error => {
                    console.error(error);
                });
            }

              
                resolve();
            });
        });
    }).catch(error => {
        console.error('Eroare la încărcarea top.html:', error);
    });








           



            













                    
























                    





         






































          



async function GetUser(userId){
    
    const link = `${API_BASE_URL}/Users/async/${userId}`;
    var user = await get(link);
    return user;
}

function logout(){
    debugger;
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
}



window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});






async function handleMenuClick(level, id, name, parentTip = '', parentCategorie = '') {
    document.getElementById("numeCatSelectata").value = name;

    if (level === 'tip') {
        selectedTip = name;
        selectedCategorie = '';
        selectedSubcategorie = '';
        getDescriere("CategoriiTip", id);
    } else if (level === 'categorie') {
        selectedTip = parentTip;
        selectedCategorie = name;
        selectedSubcategorie = '';
        getDescriere("Categorii", id);
    } else if (level === 'subcategorie') {
        selectedTip = parentTip;
        selectedCategorie = parentCategorie;
        selectedSubcategorie = name;
        getDescriere("CategoriiSub", id);
    }

    IdSubCat = id;

    try {
        let link = `${API_BASE_URL}/InfoCars/GetMenuItems?level=${level}&id=${id}`;
        const response = await fetch(link);
        const items = await response.json();

        console.log(`Filtrare pentru ${name} la nivelul ${level}`);
        console.log(items);

        
        ChangeToPiese(selectedTip, selectedCategorie, selectedSubcategorie);
    } catch (error) {
        console.error('Eroare la filtrarea pieselor:', error);
    }

    populateApiPath();
}





async function generateDynamicMenu() {
    try {
        const link = `${API_BASE_URL}/InfoCars/GetMenuItems`;
        const response = await fetch(link);
        const menuItems = await response.json();
        const menu = document.getElementById('dynamicMenu');
        const categoriiTipMap = new Map();
        const categoriiMap = new Map();

        menuItems.forEach(item => {
            const tipId = item.CategoriiTipId;
            const tipNume = item.CategoriiTipNume;
            const catId = item.CategoriiId;
            const catNume = item.CategoriiNume;
            const subId = item.CategoriiSubId;
            const subNume = item.CategoriiSubNume;

            if (tipId && tipNume) {
                if (!categoriiTipMap.has(tipId)) {
                    const tipElement = document.createElement('div');
                    tipElement.classList.add('menu-item');

                    const hasChildren = menuItems.some(mi => mi.CategoriiTipId === tipId && Number.isInteger(mi.CategoriiId) && mi.CategoriiNume);

                    tipElement.innerHTML = `<a href="#" class="menu-link">${tipNume}${hasChildren ? '&nbsp;<i class="arrow down"></i>' : ''}</a><div class="submenu"></div>`;
                    menu.appendChild(tipElement);
                    categoriiTipMap.set(tipId, tipElement.querySelector('.submenu'));

                    tipElement.querySelector('.menu-link').addEventListener('click', function () {
                        handleMenuClick('tip', tipId, tipNume);
                    });
                }

                if (Number.isInteger(catId) && catNume) {
                    if (!categoriiMap.has(catId)) {
                        const catElement = document.createElement('div');
                        catElement.classList.add('submenu-item');
                        catElement.dataset.catId = catId;

                        const hasSubChildren = menuItems.some(mi => mi.CategoriiId === catId && Number.isInteger(mi.CategoriiSubId) && mi.CategoriiSubNume);

                        catElement.innerHTML = `<a href="#" class="menu-link">${catNume}${hasSubChildren ? ' <i class="arrow right"></i>' : ''}</a><div class="subsubmenu"></div>`;
                        categoriiTipMap.get(tipId).appendChild(catElement);
                        categoriiMap.set(catId, catElement.querySelector('.subsubmenu'));

                        catElement.querySelector('.menu-link').addEventListener('click', function () {
                            handleMenuClick('categorie', catId, catNume, tipNume); 
                        });
                    }

                    if (Number.isInteger(subId) && subNume) {
                        const subElement = document.createElement('div');
                        subElement.classList.add('subsubmenu-item');
                        subElement.innerHTML = `<a href="#" class="menu-link">${subNume}</a>`;
                        categoriiMap.get(catId).appendChild(subElement);

                        subElement.querySelector('.menu-link').addEventListener('click', function () {
                            handleMenuClick('subcategorie', subId, subNume, tipNume, catNume); 
                        });
                    }
                }
            }
        });
    } catch (error) {
        console.error('Eroare la generarea meniului dinamic:', error);
    }
}
 document.addEventListener('DOMContentLoaded', async function () {
    await generateDynamicMenu();

   //const hamburger = document.getElementById('hamburgerButton');
    const menu = document.getElementById('dynamicMenu');

//    hamburger.addEventListener('click', function () {
//         this.classList.toggle('active');
//         menu.classList.toggle('active');
//     });
 });

 function populateApiPath(){
        if(marca == "" && model == "" && generatie == "" && IdSubCat == null && Nivel == null){
            pieseApiCall(populatePieseShopGrid);                       
        }
        else{
            //debugger;
            pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
            .then(data => {                
                populatePieseShopGrid(data);
            })
                .catch(error => {
                    console.error('Eroare la obținerea datelor:', error);
            });     
        }                    
}

 function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    //debugger;    
    if(marca == ""){model = ""; generatie = "";}
    if(model == ""){generatie = "";}                       
    const url = `${API_BASE_URL}/Piese/search_fields?Marca=${encodeURIComponent(marca)}&Model=${encodeURIComponent(model)}&Generatie=${encodeURIComponent(generatie)}&IdSubCat=${encodeURIComponent(IdSubCat)}&Nivel=${encodeURIComponent(Nivel)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;

    // Afișează loaderul
    // Swal.fire({
    //     title: 'Loading...',
    //     text: 'Please wait while we fetch the data.',
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //         Swal.showLoading();
    //     }
    // });

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            //debugger;
           // Swal.close(); // Ascunde loaderul la succes
            return data; // Returnează datele primite de la API
        })
        .catch(error => {            
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
            //Swal.close(); // Ascunde loaderul la eroare
            throw error;
        });
}

