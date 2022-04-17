loadMessages();
loadParticipants();
getIn();
let object_message = {
    from: "",
    to:"Todos",//Default
    text: "",
    type: "message"//Default
}

function sendMessage(){
    const input_text = document.querySelector(".input_text").value;
    object_message.text = input_text;
    

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",object_message);
    promise.then(loadMessages);
    promise.catch(reLoad);
    document.querySelector(".input_text").value="";
}


function getIn(){
    const name = prompt("Qual seu nome?");
    login(name);
}

function errorGetIn(error){
    const name = prompt("Insira um nome diferente?");
    login(name);
}

function login(name){
    const user ={
        name: name
      }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",user);

    promise.catch(errorGetIn);
    promise.then(userConected);

    function userConected(){
        object_message.from = name;
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status",user);
        setTimeout(userConected,5000);//Avisando ao servidor que o usuario esta ativo, a cada 5s.
    }
}

function loadMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    console.log(promise);

    promise.then(renderMessages);
}

function reLoad(){
    document.location.reload(true);
}

function loadParticipants(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(renderParticipants);
}

function renderParticipants(response){
    const containerParticipants = document.querySelector(".side_bar .participants");
    console.log(response.data.length);
    containerParticipants.innerHTML=`
                <p "user_item" onclick="selectedUser(this)">
                    <ion-icon class="icon" name="people"></ion-icon>
                    <span class="user_name">
                        <span class="name">Todos</span>
                        <span><ion-icon class="icon hidden_user_check" name="checkmark-sharp">Todos</ion-icon></span>
                    </span> 
                </p>
    `;

    for (let i=0; i<response.data.length; i++){
        const participants_name= response.data[i].name;
        containerParticipants.innerHTML += `
                <p class="user_item" onclick="selectedUser(this)">
                    <ion-icon class="icon" name="person-circle"></ion-icon>
                    <span class="user_name">
                        <span class="name">${participants_name}</span>
                        <span><ion-icon class="icon hidden_user_check" name="checkmark-sharp"></ion-icon></span>
                    </span> 
                </p>
                `;
    }
    setTimeout(loadParticipants,10000);
}

function renderMessages(response){
    //Um array com os objetos, tenho 100 itens
    //Quero colocar os atibutos no DOM
    const containerMessages = document.querySelector(".container .messages");
    console.log(response.data.length);
    containerMessages.innerHTML="";


    for (let i=0; i< response.data.length;i++){
        
        const message=response.data[i];
        const type_message=response.data[i].type;
        const to_message=response.data[i].to;
        const from_message=response.data[i].from;
        

        switch (type_message){//Inserindo Dinamicamente no HTML os tres tipos de menssagens
            case "status":
                containerMessages.innerHTML += `
                    <div class="status_message">
                        <p>(${message.time})&nbsp${message.from}&nbsp${message.text}</p>
                    </div>
                    `;
                containerMessages.scrollIntoView({block: "end"});//Rolagem automatica
            break;
            case "message":
                containerMessages.innerHTML += `
                    <div class="normal_message">
                        <p>(${message.time})&nbsp${message.from} para ${message.to}:&nbsp${message.text}</p>
                    </div>
                    `;
                containerMessages.scrollIntoView({block: "end"});
            break;        
            case "private_message":

                if((to_message===object_message.from)|| (from_message===object_message.from)){

                    containerMessages.innerHTML += `
                    <div class="private_message">
                        <p>(${message.time}) ${message.from} reservadamente para ${message.to}:&nbsp${message.text}</p>
                    </div>
                    `;
                    containerMessages.scrollIntoView({block: "end"});
                }
            break;    
                
        }
    }
    //Recarregando as menssagens a cada 3s.
    setTimeout(loadMessages,3000);
}

function sideBarON(){
    const displayBlock = document.querySelector(".block").classList.remove("hidden");
}

function sideBarOFF(){
    const displayBlock = document.querySelector(".block").classList.add("hidden");
}

function selectedUser(element){
    let selected= document.querySelector(".selected_user_check");
    let selected_user=document.querySelector(".selected_user");
    if (selected !== null){
        selected.classList.remove("selected_user_check");
        selected_user.classList.remove("selected_user");
        selected.classList.add("hidden_user_check");
    }
    element.querySelector(".user_name").querySelector(".icon.hidden_user_check").classList.remove("hidden_user_check");
    element.querySelector(".user_name").querySelector(".icon").classList.add("selected_user_check");
    element.querySelector(".user_name").querySelector(".name").classList.add("selected_user");

    object_message.to = document.querySelector(".selected_user").innerHTML;
    document.querySelector(".send_to_type").innerHTML=`Enviando para ${object_message.to} (${document.querySelector(".selected_type").innerHTML})`;
}

function selectedType(element){
    let selected= document.querySelector(".selected_type_check");
    let selected_type=document.querySelector(".selected_type");
    if (selected !== null){
        selected.classList.remove("selected_type_check");
        selected_type.classList.remove("selected_type");
        selected.classList.add("hidden_type_check"); 
    }
    element.querySelector(".type_msg").querySelector(".icon.hidden_type_check").classList.remove("hidden_type_check");
    element.querySelector(".type_msg").querySelector(".icon").classList.add("selected_type_check");
    element.querySelector(".type_msg").querySelector(".type_message").classList.add("selected_type");
    
    
    if (document.querySelector(".selected_type").innerHTML == "Reservadamente"){
        object_message.type= "private_message";
    }
    if (document.querySelector(".selected_type").innerHTML == "Público"){
        object_message.type= "message";
    }

    document.querySelector(".send_to_type").innerHTML=`Enviando para ${object_message.to} (${document.querySelector(".selected_type").innerHTML})`;

}


function keydown(){
    let input = document.querySelector(".input_text");
   
}