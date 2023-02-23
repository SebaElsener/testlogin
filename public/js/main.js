
const socket = io.connect()

const productsForm = document.getElementById('productsForm')
const productsList = document.getElementById('productsList')

// Escuchando listado productos enviado por el servidor
socket.on('productsTable', data => {
    // Fetch plantilla handlebars
    fetch('views/productsTemplate.hbs')
    .then(res => res.text())
    .then(htmlCode => {
        // Variables para plantilla
        const productsQty = data.length
        const allProducts = data
        // Compilado del template
        const template = Handlebars.compile(htmlCode)
        const productsTemplate = template({ productsQty, allProducts })
        // Volcando la plantila al html
        productsList.innerHTML = productsTemplate
    })
})

// ---------------------- //

const messagesForm = document.getElementById('messagesForm')
const userEmail = document.getElementById('userEmail')
const userInputFields = document.getElementsByClassName('userEmail')
const userName = document.getElementById('userName')
const userLastname = document.getElementById('userLastname')
const userAge = document.getElementById('userAge')
const userAlias = document.getElementById('userAlias')
const userAvatar = document.getElementById('userAvatar')
const messageContent = document.getElementById('messageContent')
const messagesContainer = document.getElementById('messagesContainer')
const messagesCenterTitle = document.getElementsByClassName('messagesCenterTitle')
const userWelcome = document.getElementsByClassName('userWelcome')
console.log(userWelcome)
userEmail.value = userWelcome[0].innerText

//  Validaciones para campos datos usuarios
const userDataValidations = (name, lastname, age, alias, avatar) => {
    if (name == '' || lastname == '' || age == '' || alias == '' || avatar == ''
    || name == ' ' || lastname == ' ' || age == ' ' || alias == ' ' || avatar == ' ') return false
    else return true
}

//  Envio nuevo mensaje al servidor
messagesForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // Validando campos para habilitar envío de mensajes
    const userFieldsValidation = userDataValidations(userName.value, userLastname.value, userAge.value, userAlias.value, userAvatar.value)
    if (validateUserEmail() && userFieldsValidation){
        newMessage = {
            author: {
                id: userEmail.value,
                nombre: userName.value,
                apellido: userLastname.value,
                edad: userAge.value,
                alias: userAlias.value,
                avatar: userAvatar.value
            },
            text: messagesForm[0].value
        }
        socket.emit('newMessage', newMessage)
        messagesForm.reset()
    } else {
        // Muestra error de validaciones en el input de envío de mensajes
        messageContent.style.color = 'red'
        messageContent.style.fontWeight = 'bold'
        messageContent.style.textAlign = 'center'
        messageContent.value = 'Por favor complete todos sus datos'
    }
})

//  Reset del mensaje error validación en el campo de envío de mensajes
for (let i=0;i < userInputFields.length;i++) {
    userInputFields[i].addEventListener('click', () => {
        messageContent.style.color = 'black'
        messageContent.style.fontWeight = 'normal'
        messageContent.style.textAlign = 'left'
        messageContent.value = ''
    })
}

//  Schema normalización mensajes
const authorSchema = new normalizr.schema.Entity('author')
const postSchema = new normalizr.schema.Entity('post', { author: authorSchema }, { idAttribute: '_id' })
const postsSchema = new normalizr.schema.Entity('posts', { mensajes: [postSchema] })

// Escuchando listado mensajes enviado por el servidor
socket.on('allMessages', data => {
    const { normalizedMessages, originalDataLength } = data
    const denormalizedMessages = normalizr.denormalize(normalizedMessages.result, postsSchema, normalizedMessages.entities)
    const normalizedMessagesLength = JSON.stringify(normalizedMessages).length
    let compressionRatio
    originalDataLength === 2
        ? compressionRatio = 0
        : compressionRatio = ((normalizedMessagesLength * 100) / originalDataLength).toFixed(2)
    messagesCenterTitle[0].innerText = `Centro de Mensajes - Compresión: ${compressionRatio}%`
    const msgMapping = denormalizedMessages.mensajes.map(message => {
        return `<div id='messagesDiv'>
                    <div class='userDataContainer'>
                    <div class='userImgContainer'>
                        <img class='userImg' src='${message.author.avatar}' alt='[avatar usuario ${message.author.alias}]' width='30px'>
                    </div>
                    <b style="color: blue" class='msgAuthor'>${message.author.alias}</b>
                    <span style="color: brown">[ ${message.date} ]</span>
                    </div>
                    <div class='textContainer'>
                    <i style="color: green">=>  ${message.text}</i>
                    </div>

                </div>`
    })
    messagesContainer.innerHTML = msgMapping.join(' ')
})

// Función validadora de email
const validateUserEmail = () => {
    const emailPattern =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    let validEmail
    emailPattern.test(userEmail.value) ? validEmail = true : validEmail = false
    return validEmail
}