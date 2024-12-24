//PAGE LOAD
document.addEventListener('DOMContentLoaded', async  () => {
    await getTip();     
    await getCars(`${API_BASE_URL}/Cars/getAll`); 
});

//TIP
const TipDropdown = document.getElementById('ddd_Tip');
async function getTip(){
    //debugger;
    const link = `${API_BASE_URL}/CategoriiTip`;   
    const tip = await get(link);
    populateTip(tip);
}
function populateTip(tip){
    //debugger;    
    tip.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.text = item.tip; 
        TipDropdown.add(option);
    });
}
TipDropdown.addEventListener('change', function() {
    debugger;        
    const tipId = getSelectedValue('ddd_Tip');
    const tipText = getSelectedText('ddd_Tip');   
    if(document.getElementById("tb_Tip")){document.getElementById("tb_Tip").value = tipText;}    
    document.getElementById('ddd_Categorii').innerHTML = '<option value="">---</option>';
    if (tipId) {
        getCategorii(tipId);
    } else {
        // Curăță dropdown-ul        
    }
});
async function addEdit_Tip(){
    debugger;         
    const tipId = getSelectedValue('ddd_Tip');      

    var tip = document.getElementById("tb_Tip");  
    if(tip.value == ""){        
        verifRed(tip.id);
        return;
    }  
    
    const data = {
        Id: tipId,
        tip:  document.getElementById("tb_Tip").value         
    };   
    if(tipId == ""){//post
        data.Id = 0;
        const link = `${API_BASE_URL}/CategoriiTip`; 
        insert(data,link);
        showInsertSuccessMessage();
    } 
    else{ //put
        const link = `${API_BASE_URL}/CategoriiTip?id=` + tipId; 
        update(tipId,data,link );
        showUpdateSuccessMessage();
    }
    clearddd('ddd_Tip');
    cleartb('tb_Tip');
    setTimeout(() => {
        getTip();  
    }, 500); 
}
async function remove_Tip(){
    debugger;
    const tipId = getSelectedValue('ddd_Tip');  

    var tip = document.getElementById("ddd_Tip");   
    if(tipId == ""){        
        verifRed(tip.id);
        return;
    }   
    const link = `${API_BASE_URL}/CategoriiTip/` + tipId;  
    try{

        // Confirmarea ștergerii
        Swal.fire({
            title: 'Ești sigur?',
            text: 'Acest tip va fi sters!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, sterge!'
        }).then((result) => {
            if (result.isConfirmed) {                                       
                del(tipId,link);
                clearddd('ddd_Tip');
                cleartb('tb_Tip');    
                setTimeout(() => {
                    getTip();  
                }, 500); 
                showDeleteSuccessMessage();
            }
        });      
    }
    catch(err){
        showErrorMessage(err.message);
    }       
}

//CATEGORII
async function getCategorii(tipId){
    debugger;
    
    const link = `${API_BASE_URL}/Categorii/GetCategByTipId?idTip=` + tipId;   
    const categ = await get(link);
    populateCategs(categ);
}
const CategDropdown = document.getElementById('ddd_Categorii');
function populateCategs(categ){
    debugger;
    
    categ.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.text = item.categorie;
        CategDropdown.add(option);
    });
}
CategDropdown.addEventListener('change', function() {
    debugger;        
    const catId = getSelectedValue('ddd_Categorii');
    const catText = getSelectedText('ddd_Categorii');       
    if(document.getElementById("tb_numeCat")){document.getElementById("tb_numeCat").value = catText;}   
    if (catId) {
        subCategorii();
    } else {
        clearddd('ddd_subcateg');
    }
});
async function addEdit_Categ(){
    debugger;   
    var categ = document.getElementById("tb_numeCat");  
    if(categ.value == ""){        
        verifRed(categ.id);
        return;
    }  
    const catId = getSelectedValue('ddd_Categorii');     
    const tipId = getSelectedValue('ddd_Tip');    
    const data = {
        Id: catId,
        Categorie:  document.getElementById("tb_numeCat").value,
        Tip: tipId         
    };   
    if(catId == ""){//post
        data.Id = 0;
        const link = `${API_BASE_URL}/Categorii`; 
        insert(data,link);
        showInsertSuccessMessage();
    } 
    else{ //put
        const link = `${API_BASE_URL}/Categorii?id=` + catId; 
        update(catId,data,link );
        showUpdateSuccessMessage();
    }
    clearddd('ddd_Categorii');
    cleartb('tb_numeCat');    
    setTimeout(() => {
        getCategorii(tipId);  
    }, 500); 
}
async function remove_Categ(){
    debugger;
    const catId = getSelectedValue('ddd_Categorii');  
    const tipId = getSelectedValue('ddd_Tip');         
    var categ = document.getElementById("ddd_Categorii");   
    if(catId == ""){        
        verifRed(categ.id);
        return;
    }   
    const link = `${API_BASE_URL}/Categorii/` + catId;  
    try{
        // Confirmarea ștergerii
            Swal.fire({
            title: 'Ești sigur?',
            text: 'Aceasta categorie va fi stearsa!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, sterge!'
        }).then((result) => {
            if (result.isConfirmed) {                                                          
                del(catId,link);
                clearddd('ddd_Categorii');
                cleartb('tb_numeCat');
                setTimeout(() => {
                    getCategorii(tipId);  
                }, 500);  
                
                showDeleteSuccessMessage();
            }
        });         
    }
    catch(err){
        showErrorMessage(err.message);
    }   
}

//SUBCATEGORII
async function subCategorii(){
    debugger;
    var x = getSelectedValue("ddd_Categorii");
    const link = `${API_BASE_URL}/CategoriiSub/GetSubCategById?idCateg=` + x;  
    const subcateg = await get(link); 
    populateSubCategs(subcateg);
}
const tipSubCategDropdown = document.getElementById('ddd_subcateg');
function populateSubCategs(subcateg){
    debugger;    
    clearddd('ddd_subcateg');    
    subcateg.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.text = item.numeSubCat; // Presupunem că acesta este câmpul pentru numele culorii
        tipSubCategDropdown.add(option);
    });
}
tipSubCategDropdown.addEventListener('change', function() {
    debugger;        
    const subcatId = getSelectedValue('ddd_subcateg');
    const subcatText = getSelectedText('ddd_subcateg');       
    if(document.getElementById("tb_numeSubCat")){document.getElementById("tb_numeSubCat").value = subcatText;}     
});
async function addEdit_SubCateg(){
    debugger;    
    const subcatId = getSelectedValue('ddd_subcateg');     
    const catId = getSelectedValue('ddd_Categorii');    

    var subcateg = document.getElementById("tb_numeSubCat");  
    if(subcateg.value == ""){        
        verifRed(subcateg.id);
        return;
    }  
    const data = {
        Id: subcatId,
        NumeSubCat:  document.getElementById("tb_numeSubCat").value,
        IdCateg: catId         
    };   
    if(subcatId == ""){//post
        data.Id = 0;
        const link = `${API_BASE_URL}/CategoriiSub`; 
        insert(data,link);
        showInsertSuccessMessage();
    } 
    else{ //put
        const link = `${API_BASE_URL}/CategoriiSub?id=` + subcatId; 
        update(subcatId,data,link );
        showUpdateSuccessMessage();
    }
    clearddd('ddd_subcateg');
    cleartb('tb_numeSubCat');;  
    setTimeout(() => {
        subCategorii();  
    }, 500);  
}

async function remove_subCateg(){
    debugger;
    const subcatId = getSelectedValue('ddd_subcateg');  
    const catId = getSelectedValue('ddd_Categorii');   
    
    var subcateg = document.getElementById("ddd_subcateg");   
    if(subcatId == ""){        
        verifRed(subcateg.id);
        return;
    }      
    const link = `${API_BASE_URL}/CategoriiSub/` + subcatId;  
    try{

         // Confirmarea ștergerii
         Swal.fire({
            title: 'Ești sigur?',
            text: 'Aceasta subcategorie va fi stearsa!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, sterge!'
        }).then((result) => {
            if (result.isConfirmed) {                                                          
                del(catId,link);
                clearddd('ddd_subcateg');
                cleartb('tb_numeSubCat');
                setTimeout(() => {
                    subCategorii();  
                }, 500);   

                showDeleteSuccessMessage();
            }
        });              
    }
    catch(err){
        showErrorMessage(err.message);
    }       
}

//MARCA
async function addEdit_Car(){
    debugger;         
    const carId = getSelectedValue('ddd_cars');   
    var car = document.getElementById("tb_cars");   
    if(car.value == ""){        
        verifRed(car.id);
        return;
    }         
    const data = {
        marcaID: carId,
        marcaName:  document.getElementById("tb_cars").value         
    };   
    if(carId == ""){//post
        data.marcaID = 0;        
        const link = `${API_BASE_URL}/Cars/marca`; 
        insert(data,link);
        showInsertSuccessMessage();
    } 
    else{ //put        
        const link = `${API_BASE_URL}/Cars/marca/` + carId; 
        update(carId,data,link );
        showUpdateSuccessMessage();
    }
    clearddd('ddd_cars');
    cleartb('tb_cars');
    setTimeout(() => {
        getCars(`${API_BASE_URL}/Cars/getAll`);
    }, 500); 
}

async function remove_Car(){
    debugger;    
    const carId = getSelectedValue('ddd_cars');  
    var car = document.getElementById("ddd_cars");   
    if(carId == ""){        
        verifRed(car.id);
        return;
    }   
    const link = `${API_BASE_URL}/Cars/marca/` + carId;  
    try{
        // Confirmarea ștergerii
        Swal.fire({
            title: 'Ești sigur?',
            text: 'Aceasta marca va fi ștearsă!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, sterge!'
        }).then((result) => {
            if (result.isConfirmed) {                       
                del(carId,link);
                clearddd('ddd_cars');
                cleartb('tb_cars');  
                setTimeout(() => {
                    getCars(`${API_BASE_URL}/Cars/getAll`);
                }, 500);
                showDeleteSuccessMessage();
            }
        });
        }
        catch(err){
            showErrorMessage(err.message);
        }        
}

//MODEL
async function addEdit_Model(){
    debugger;         
    const modelId = getSelectedValue('ddd_models');            
    const marcaId = getSelectedValue('ddd_cars');     
    var model = document.getElementById("tb_models"); 
    if(model.value == ""){        
        verifRed(model.id);
        return;
    } 
    const data = {
        modelID: modelId,
        marcaID: marcaId,
        modelName:  document.getElementById("tb_models").value         
    };   
    if(modelId == ""){//post
        data.modelID = 0;        
        const link = `${API_BASE_URL}/Cars/model`; 
        insert(data,link);
        showInsertSuccessMessage();
    } 
    else{ //put        
        const link = `${API_BASE_URL}/Cars/model/` + modelId; 
        update(modelId,data,link );
        showUpdateSuccessMessage();
    }
    clearddd('ddd_models');
    cleartb('tb_models');

    setTimeout(() => {
        getModelsForDropdown(marcaId, populateModelsDropdown);
    }, 500); 
}

async function remove_Model(){     
    const modelId = getSelectedValue('ddd_models');  
    const marcaId = getSelectedValue('ddd_cars'); 
    var model = document.getElementById("ddd_models");   
    if(modelId == ""){        
        verifRed(model.id);
        return;
    }   
    const link = `${API_BASE_URL}/Cars/model/` + modelId;  
    try{
        // Confirmarea ștergerii
        Swal.fire({
            title: 'Ești sigur?',
            text: 'Acest model va fi sters!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, sterge!'
        }).then((result) => {
            if (result.isConfirmed) {                       
                del(modelId,link);
                clearddd('ddd_models');
                cleartb('tb_models');   
                debugger;                                
                setTimeout(() => {
                    getModelsForDropdown(marcaId, populateModelsDropdown);
                }, 500); 
                showDeleteSuccessMessage();
            }
        });
    }
    catch(err){
        showErrorMessage(err.message);
    }         
}

//GENERATIE
async function addEdit_Generatie(){
    debugger;         
    const generatieId = getSelectedValue('ddd_generatii');            
    const modelId = getSelectedValue('ddd_models');           
    var generatie = document.getElementById("tb_generatii"); 
    if(generatie.value == ""){        
        verifRed(generatie.id);
        return;
    } 
    const data = {
        generatieId: generatieId,
        modelId: modelId,
        generatieName:  document.getElementById("tb_generatii").value         
    };   
    if(generatieId == ""){//post
        data.generatieId = 0;        
        const link = `${API_BASE_URL}/Cars/generatie`; 
        insert(data,link);
        showInsertSuccessMessage();
    } 
    else{ //put        
        const link = `${API_BASE_URL}/Cars/generatie/` + generatieId; 
        update(generatieId,data,link );
        showUpdateSuccessMessage();
    }
    clearddd('ddd_generatii');
    cleartb('tb_generatii');

    setTimeout(() => {
        getGeneratiiForDropdown(modelId, populateGeneratiiDropdown);
    }, 500); 
}

async function remove_Generatie(){     
    const generatieId = getSelectedValue('ddd_generatii');  
    const modelId = getSelectedValue('ddd_models');  

    var generatie = document.getElementById("ddd_generatii");   
    if(generatieId == ""){        
        verifRed(generatie.id);
        return;
    }   
    const link = `${API_BASE_URL}/Cars/generatie/` + generatieId;  
    try{
        // Confirmarea ștergerii
        Swal.fire({
            title: 'Ești sigur?',
            text: 'Aceasta generatie va fi stearsa!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, sterge!'
        }).then((result) => {
            if (result.isConfirmed) {                       
                del(generatieId,link);
                clearddd('ddd_generatii');
                cleartb('tb_generatii');   
                debugger;                                
                setTimeout(() => {
                    getGeneratiiForDropdown(modelId, populateGeneratiiDropdown);
                }, 500); 

                showDeleteSuccessMessage();
            }
        });
    }
    catch(err){
        showErrorMessage(err.message);
    }         
}



