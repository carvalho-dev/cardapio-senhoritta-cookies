const divProdutos = document.querySelector(".div-produtos"); //Variavel para pegar a div de produtos
const btnFiltro = document.querySelectorAll(".div-nav button"); //Variavel para pegar os botoes da div
const inputSearch = document.querySelector(".div-input-search input");

let textoBusca = "";
const memoriaCarrinho = {};

const cardapio = { //Variável para criar o objeto cardapio
    "Tradicional": [ //Lista com varios objetos (cookies)
        { //Propriedade do objeto: id, nome, preco, descricao e imagem
            id: 101,
            nome: "Cookie Tradicional de Nutella",
            preco: 10.00,
            descricao: "Massa amanteigada crocante por fora, macia por dentro e cheia de gotas de chocolate.",
            imagem: "images/trad.png"
        },
        { //propriedade do objeto: id, nome, preco, descricao e imagem
            id: 102,
            nome: "Chocolate",
            preco: 10.00, 
            descricao: "Massa escura e intensa com pedaços de chocolate que derretem na boca",
            imagem: "images/choc.png"
        }
    ],

    "Recheado": [ //Lista com varios objetos (cookies)
        { //Propriedade do objeto: id, nome, preco, descricao e imagem
            id: 201,
            nome: "Nutella",
            preco: 12.00,
            descricao: "O clássico cookie dourado com um recheio generoso e cremoso de creme de avelã.",
            imagem: "images/nut.png"
        }
    ],

    "Marmita": [ //Lista com varios objetos (cookies)
        { //Propriedade do objeto: id, nome, preco, descricao e imagem
            id: 301,
            nome: "Marmita 01",
            preco: 20.00,
            descricao: "Marmita top.",
            imagem: "images/mar.png"
        }
    ],
    
    "Combo": [ //Lista com varios objetos (cookies)
        { //Propriedade do objeto: id, nome, preco, descricao e imagem
            id: 401,
            nome: "Combo 01",
            preco: 45.00,
            descricao: "Cookie Tradicional, Cookie...",
            imagem: "images/combo.png"
        }
    ],
}

inputSearch.addEventListener("input", (e) => {
    
    textoBusca = e.target.value.toLowerCase().trim();

    if (textoBusca.length > 0) {

        btnFiltro.forEach(b => b.classList.remove("ativo"));

    }

    criarCards();
})

btnFiltro.forEach((botao) => { //Cria um lista com todos os botões da div-nav
    botao.addEventListener("click", () => { //Evento de click (quando clicar)

        textoBusca = "";

        inputSearch.value = "";

        btnFiltro.forEach(b => b.classList.remove("ativo")); //Primeiro vai tirar a classe de ativo de todos os botões

        botao.classList.add("ativo"); //Depois coloca no botão que foi clicado

        const catSelecionada = botao.innerText; //Pega o texto do botão que foi selecionado e coloca na variavel

        criarCards(catSelecionada); // Chama a função de Criar os Cards usando como valor padrão o botão selecionado
    });
});

function criarCards(catFiltro = "Todos") { //Cria funcao para criar os cards com filtro por padrão que ja comece filtrando por Todos
    
    divProdutos.innerHTML = ""; //Limpa a div

    for (let categoria in cardapio) { //Laco criando uma variavel com nome "categoria" dentro do objeto "cardapio"
        
        if (categoria === catFiltro || catFiltro === "Todos") { //Se está com todos, ele cria a div com todos os elementos
            
            cardapio[categoria].forEach((cookie) => { //Cria uma lista percorrendo a lista de obejtos um por um

                const nome = cookie.nome.toLowerCase();

                if (textoBusca && !nome.includes(textoBusca)) {
                    return
                }

                const quantidade = memoriaCarrinho[cookie.id] || 0;

                //Varíavel que armazena a div dos cards de cada cookie
                const cardCookie = `
                    <div class="div-cookie" id="${cookie.id}" data-preco="${cookie.preco}">
                        <div class="img-wrapper">
                            <img name="img-cookie" src="${cookie.imagem}" alt="foto_${cookie.nome}">
                        </div>
                        <div class="div-cabecalho-cookie">
                            <h1>${cookie.nome}</h1>
                            <span>R$ ${parseFloat(cookie.preco).toFixed(2).replace('.',',')}</span>
                        </div>
                        <div class="div-descricao">
                            <p>${cookie.descricao}</p>
                        </div>
                        <div class="div-add-carrinho">
                            <div class="div-quantidade" style="${memoriaCarrinho[cookie.id] > 0 ? 'display:flex' : 'display:none'}">
                                <i name="less-button" class="bi bi-dash-circle-fill"></i>
                                <span>${quantidade}</span>
                                <i name="more-button" class="bi bi-plus-circle-fill"></i>
                            </div>
                            <button class="add-button" style="${quantidade}">Adicionar</button>
                        </div>                    
                    </div>
                `;

                divProdutos.insertAdjacentHTML("beforeend", cardCookie) //Inseri os cards dentro da div de produtos na mesma ordem do array, se quiser colocar ao contrario adiciona "afterbegin", assim ele vai se comportar igual um feed de rede social
            
            });

        }
        
    }

    attCarinho()

    configBtn(); //Chama a  função que faz os botões dos cards funcionar
}

function attCarinho() {
    
    let valorTotal = 0;

    for (let id in memoriaCarrinho) {

        const quantidade = memoriaCarrinho[id];
        let precoCookie = 0;

        for (let categoria in cardapio) {

            const cookieEncontrado = cardapio[categoria].find(c => c.id === parseInt(id));
            if (cookieEncontrado) {
                precoCookie = cookieEncontrado.preco;
                break;
            }
        }
    
        valorTotal += precoCookie * quantidade;

    }

    const totalCarrinho = document.querySelector(".div-carrinho span")

    totalCarrinho.innerText = `R$ ${valorTotal.toFixed(2).replace('.',',')}`
}

function configBtn() { //Função dos botões dos cards

    const todosCards = document.querySelectorAll(".div-cookie"); //Variavel para pegar todas as divs(cards) com essa classe

    todosCards.forEach((card) => { //Cria um lista com cada div(card) para percorrer um por um

        const idCookie = card.id;
        //Variaves para pegar itens especificos dentro de cada div(card), pois são intens repetidos
        const btnAdd = card.querySelector(".add-button"); //Pegou o item usando a classe
        const divQuant = card.querySelector(".div-quantidade"); //Pegou o item usando a classe
        const btnLess = card.querySelector('[name="less-button"]'); //Pegou o item usando o name
        const btnMore = card.querySelector('[name="more-button"]'); //Pegou o item usando o name
        const qtdSpan = card.querySelector(".div-quantidade span"); //Pegou o item usando a classe

        btnAdd.addEventListener("click", () => { //Adiciona o evento de click no botão
            divQuant.style.display = "flex"; //Ateração no estilo da div, deixando ela visivel

            if (qtdSpan.innerText === "0" || qtdSpan.innerText === "") { //Se o texto do span for 0 ou vazio
                memoriaCarrinho[idCookie] = 1;
                qtdSpan.innerText = "1"; //Muda o texto do span para 1
            }

            attCarinho()
        });

        btnMore.addEventListener("click", () => { //Adiciona o evento de click no botão
            let qtdAtual = parseInt(qtdSpan.innerText) || 0; //Cria variavel (qtdAtual) para converter a outra (qtdSpan) em numero inteiro para fazer calculo
            qtdSpan.innerText = qtdAtual + 1; //Faz o calculo adicionado + 1 e colocando o resultando dentro do texto da varialvel (qtdSpan)

            memoriaCarrinho[idCookie] = qtdAtual + 1;

            attCarinho()
        });

        btnLess.addEventListener("click", () => { //Adiciona o evento de click no botão
            let qtdAtual = parseInt(qtdSpan.innerText) || 0; //Cria variavel (qtdAtual) para converter a outra (qtdSpan) em numero inteiro para fazer calculo

            if (qtdAtual > 0) { //Se o valor em numero inteiro do span for maior que 0
                qtdSpan.innerText = qtdAtual - 1 //Faz o calculo subtraindo - 1 e colocando o resultando dentro do texto da varialvel (qtdSpan)
                memoriaCarrinho[idCookie] = qtdAtual - 1;
            }

            if (parseInt(qtdSpan.innerText) === 0) { //Se o valor em numero inteiro do span for igual que 0
                divQuant.style.display = "none"; //Ateração no estilo da div, deixando ela invisivel
            
                delete memoriaCarrinho[idCookie];
            }

            attCarinho()
        });

    });

}

criarCards();

function finalizarPedido() {

    const numero = "554391752441"; // 🔥 SEU NÚMERO AQUI

    let mensagem = " *Olá, gostaria de fazer um pedido:*%0A%0A";

    let total = 0;

    for (let id in memoriaCarrinho) {

        for (let categoria in cardapio) {
            const item = cardapio[categoria].find(c => c.id === parseInt(id));

            if (item) {
                const qtd = memoriaCarrinho[id];
                const subtotal = item.preco * qtd;

                mensagem += `• ${item.nome} x${qtd} = R$ ${subtotal.toFixed(2)}%0A`;

                total += subtotal;
            }
        }
    }

    mensagem += `%0A *Total do Pedido: R$ ${total.toFixed(2)} (Taxa de entrega a consultar)*`;

    const url = `https://wa.me/${numero}?text=${mensagem}`;

    window.open(url, "_blank");
}