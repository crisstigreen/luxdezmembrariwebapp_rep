//PAGE LOAD
document.addEventListener('DOMContentLoaded', async  () => {
    await getTip();        
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
    const link = `${API_BASE_URL}/CategoriiTip/` + tipId;  
    try{
        del(tipId,link);
        showDeleteSuccessMessage();
    }
    catch(err){
        showErrorMessage(err.message);
    }
    clearddd('ddd_Tip');
    cleartb('tb_Tip');    
    setTimeout(() => {
        getTip();  
    }, 500); 
    
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
        option.text = item.categorie; // Presupunem că acesta este câmpul pentru numele culorii
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
    const link = `${API_BASE_URL}/Categorii/` + catId;  
    try{
        del(catId,link);
        showDeleteSuccessMessage();
    }
    catch(err){
        showErrorMessage(err.message);
    }
    clearddd('ddd_Categorii');
    cleartb('tb_numeCat');
    setTimeout(() => {
        getCategorii(tipId);  
    }, 500);  
    
}




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
    const link = `${API_BASE_URL}/CategoriiSub/` + subcatId;  
    try{
        del(catId,link);
        showDeleteSuccessMessage();
    }
    catch(err){
        showErrorMessage(err.message);
    }
    clearddd('ddd_subcateg');
    cleartb('tb_numeSubCat');
    setTimeout(() => {
        subCategorii();  
    }, 500);   
    
}


