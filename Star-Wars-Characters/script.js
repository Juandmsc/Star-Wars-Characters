let currentPageUrl = 'https://swapi.dev/api/people/'

window.onload = async () => {                                      // (WINDOW.ONLOAD): Toda vez que a página for carregada, ela vai chamar essa função .
  try {                                                            // (TRY, CATCH): TRY = Tentativa, ou seja, tentará fazer o que está dentro das chaves, se for bem sucedido irá executar o que estiver dentro das chaves, caso o contrário,
    await loadCharacters(currentPageUrl);                          // (loadCharacters): essa função irá pegar a URL da (currentPageUrl), e irá fazer uma requísição para a API com essa URL, trazendo os resultados e transformando-os em cards.
  } 
    catch (error) {                                                // executará o CATCH = pegar, que mostrará um ERRO no console.
    alert('Erro ao carregar cards');
     console.log();                                               
  }

  const nextButton = document.getElementById('next-button')        //Essa variável representa o elemento do bottão
  const backButton = document.getElementById('back-button')

  nextButton.addEventListener('click', loadNextPage) // O addEventListener irá monitorar eventos nesse elemento(que nesse caso é o CLICK).
  backButton.addEventListener('click', loadPreviousPage)
};

    async function loadCharacters(url) {                           
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = '';                                    //Limpar os resultados anteriores, para não repetir os mesmos cards quando ir para a próxima página
    
    try { 

    const response = await fetch(url)                              // O fetch está fazendo a requísição da URL (que é a URL da API), que está sendo pega, está enviando para loadCharacters(dentro do Window.onload), está sendo recebida no loadCharacters( da async function) e está sendo utilizada aqui(const response), que irá armazenar o resultado dessa requísição.
    const responseJson = await response.json();                    // O que recebemos da API não vem em formato Json, então para podermos iterar normalmente com o array, é necessário ter esses dados no formato Json.

    responseJson.results.forEach((character) => {                  // O forEach irá fazer um loop e iterar com todos os objetos do array, que estará sendo recebido (character).
        const card = document.createElement("div")                 //O createElement irá criar um elemento HTML, pode ser uma nova div, um novo span, um novo h1, qualquer Tag pode ser criada usando esse método, utilizando JavaScript.
        card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
        card.className = "cards"

        const characterNameBG = document.createElement("div")
        characterNameBG.className = "character-name-bg"

        const characterName = document.createElement("span")
        characterName.className = "character-name"
        characterName.innerText = `${character.name}`

        characterNameBG.appendChild(characterName)                 // O appendChild básicamente pega o elemento (que nesse caso é o characterNameBG) e coloca um filho dentro dele (insere um elemento dentro de outro elemento).
        card.appendChild(characterNameBG)

        card.onclick = () => {
            const modal = document.getElementById("modal")
            modal.style.visibility ="visible"

            const modalContent = document.getElementById("modal-content")
            modalContent.innerHTML = ''

            const characterImage = document.createElement("div")
            characterImage.style.backgroundImage =
            `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg`    
            characterImage.className = "character-image"

            const name = document.createElement("span")
            name.className = "character-details"
            name.innerText = `Nome: ${character.name}`
            
            const characterHeight = document.createElement("span")
            characterHeight.className = "character-details"
            characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

            const mass = document.createElement("span")
            mass.className = "character-details"
            mass.innerText = `Peso: ${converMass(character.mass)}`

            const eyeColor = document.createElement("span")
            eyeColor.className = "character-details"
            eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

            const birthYear = document.createElement("span")
            birthYear.className = "character-details"
            birthYear.innerText = `Nascimento: ${converBirthYear(character.birth_year)}`

            modalContent.appendChild(characterImage)
            modalContent.appendChild(name)
            modalContent.appendChild(characterHeight)
            modalContent.appendChild(mass)
            modalContent.appendChild(eyeColor)
            modalContent.appendChild(birthYear)
        }

        mainContent.appendChild(card)
    });

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.disabled = !responseJson.next                        // O botão estará desabilitado quando o (!response.next) for falso(false).
    backButton.disabled = !responseJson.previous

    backButton.style.visibility = responseJson.previous? "visible" : "hidden"

    currentPageUrl = url                                           //Toda vez que a página for carregada ou o botão próximo/anterior for clicado, esse valor da variável será alterado dinâmicamente.

    } catch (error) {                                                
        alert('Erro ao carregar os personagens');
       console.log(error);                                               
    }
} 

async function loadNextPage() {
    if (!currentPageUrl) return;  //Isso é para previnir um erro, então se(if) o valor da variável(que nesse caso é a currentPageUrl1) for nulo(null, false) ele dará um return, ou seja, ele irá interromper a execução da sessão aqui mesmo, e não irá fazer mais nada.

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.next)

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}



async function loadPreviousPage() {
    if (!currentPageUrl) return; 

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.previous)

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avela",
        unknown: "desconhecida"
    };

    return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height) {
    if (height === "unknown") {
        return "desconhecida"
    }

    return (height / 100).toFixed(2);
}

function converMass(mass) {
    if (mass === "unknown") {
        return "desconhecido"
    }

    return `${mass} kg`
}

function converBirthYear(birthYear) {
    if(birthYear === "unknown") {
        return "desconhecido"
    }

    return birthYear
}