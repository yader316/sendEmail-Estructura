const expresiones={
    usuario:/^[a-zA-Z0-9\_\-]{4,16}$/,// Letras,numeros,guionyguion_bajo
    nombre:/^[a-zA-ZA-ÿ\s]{1,40}$/,// Letrasyespacios,pueden llevar acentos.
    password:/^.{4,12}$/,//4a12 digitos.
    correo:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono:/^\d{7,14}$/ //7a14 numeros.
}


const formulario = document.getElementsByTagName('formcontent');


for(let i=0;i<formulario.length;i++){

    //data-services recorriendo los servicios.
    const servicesItems = formulario[i].getAttribute('data-services')?.split(',').map((item) =>{
        return `<option value=${item}>${item}</option>`
    });

    formulario[i].innerHTML=`
        <div class="formcontent">
            <div class="formcontent__container">
                <form action='send-email' method="POST">

                <div class="formcontent__nameContent">
                    <input type="text" name="name" class="formcontent__name form-control" placeholder="name" autofocus required>
                    <input type="text" name="lastName" class="formcontent__lastName form-control" placeholder="Last Name" required>
                </div>

                <div class="formcontent__emailPhone">
                    <input type="text" name="email" placeholder="Email" class="formcontent__email form-control" required>
                    <input type="number" name="phone" placeholder="Phone" class="formcontent__phone form-control" required>
                </div>

                <div class="formcontent__addressContent">
                    <input type="text" name="address" placeholder="Address" class="formcontent__address form-control" required>
                </div>

                <div class="formcontent__menuContent">
                    <select name="services" class="formcontent__menu form-control">
                        <option selected disabled value="Type You Services You Need">Type You Services You Need</option>
                        ${servicesItems}
                    </select>
                </div>

                <div class="formcontent__checkContent">
                    <p>Best Way To Contact You</p>
                    <div class="formcontent__check">
                        <div class="formcontent__checkOpt">
                            <input type="checkbox" class="form-check-input" name="phoneCheck" value="Phone">
                            <label class="form-check-label" for="phoneCheck">Phone</label>
                        </div>
                        <div class="formcontent__checkOpt">
                            <input type="checkbox" class="form-check-input" name="emailCheck" value="Email">
                            <label class="form-check-label" for="emailCheck">Email</label>
                        </div>
                    </div>
                </div>

                <div class="formcontent__menssageContent">
                    <textarea name="message"  placeholder="Message" class="formcontent__messages form-control"  required></textarea>
                </div>

                <button class="formcontent__btn" id="send">
                    Send Message
                </button>

            </form>
            </div>
        </div>
    `
}


document.getElementById('send').addEventListener('click', (e) => {

    e.preventDefault();

    const datos = {};
    const inputs = document.querySelectorAll('formcontent input');
    const serviceSelector = document.querySelectorAll('formcontent select');
    const checkBox = document.querySelectorAll('.form-check-input');
    const textarea = document.querySelector('formcontent textarea');

    inputs.forEach(input => {
        datos[input.name] = input.value;
    });

    serviceSelector.forEach(services => {
        datos[services.name] = services.value;
    });

    checkBox.forEach((check) => {
        if(check.checked === true){
            datos[check.name] = check.value;
        }
    });

    datos['message'] = textarea.value;

    datos.correo = document.querySelector('formcontent').getAttribute('data-correo');
    datos.logo = document.querySelector('formcontent').getAttribute('data-logo');

    var respuesta = confirm('¿Estas seguro de enviar el correo?');

    if (respuesta) {

        fetch('https://emailsenderint.herokuapp.com/send-email', {
            method: 'POST', body: JSON.stringify(datos), headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        .then(function (response) {
            if (response.status === 200) {
                alert('mensaje enviado');
                //limpiar inputs
                inputs.forEach(input => {
                    input.value = '';
                })
                // limipiar textarea
                textarea.value = '';
                //limpiar checkbox
                for (let i = 0; i < checkBox.length; i++) {
                    checkBox[i].checked = false;
                }
                //limpiar select
                serviceSelector.forEach(services => {
                    services.selectedIndex = 0;
                });
            } else {
                alert('mensaje no enviado');
            }
        })
        .catch(function (error) {
            alert('mensaje no enviado');
        });
    }
    else {
        return false;
    }
})