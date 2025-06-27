document.addEventListener('DOMContentLoaded', function() {
    debugger;    
    const guid = getQueryParam('guid');       
    
    const link = `${API_BASE_URL}/Email/update-status/` + guid;
    update(guid,guid,link );
});

function loginRedirect(){
    window.location.href = "login.html";
}