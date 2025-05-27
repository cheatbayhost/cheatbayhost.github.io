const API_URL = "https://github.com/cheatbayhost/CheatBay/db.json";
const produtosContainer = document.querySelector(".grid-produtos");

function adicionarAoCarrinho(productId) {
  console.log(`Produto ${productId} adicionado ao carrinho`);
}

function configurarFiltros() {
  const botoesFiltro = document.querySelectorAll(".filtro-jogos button");
  
  botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
      botoesFiltro.forEach(btn => btn.classList.remove('filtro-ativo'));
      botao.classList.add('filtro-ativo');
      
      const filtro = botao.dataset.filter;
      document.querySelectorAll(".produto-card").forEach(card => {
        card.style.display = (filtro === "todos" || card.dataset.game === filtro) ? "block" : "none";
      });
    });
  });
}

function renderizarProdutos(produtos) {
    produtosContainer.innerHTML = produtos.map(produto => {
        // Defina o nome da imagem baseado no produto
        let imageName;
        
        if(produto.jogo === "Free Fire") {
            imageName = "freefire.jpg";
        } else if(produto.jogo === "Standoff") {
            imageName = "standoff.jpg";
        } else {
            imageName = "placeholder.jpg"; // Fallback
        }
        
        const imageUrl = `images/${imageName}`;
        
        return `
        <article class="produto-card">
            <div class="produto-imagem">
                <img src="${imageUrl}" 
                     alt="${produto.nome}">
            </div>
        <div class="produto-info">
          <div class="jogo-badge">
            <span class="script-tag">SCRIPT</span>
            <span class="jogo-tag">${produto.jogo}</span>
          </div>
          <h3>${produto.nome}</h3>
          <p class="descricao">${produto.descricao}</p>
          <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
          <button class="btn-comprar" data-id="${produto.id}">Comprar Agora</button>
        </div>
      </article>
      `;
    }).join('');
  
    document.querySelectorAll('.btn-comprar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        adicionarAoCarrinho(productId);
      });
    });
  
    configurarFiltros();
}

async function carregarProdutos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro na API: " + response.status);
    
    const produtos = await response.json();
    if (produtos.length === 0) throw new Error("Nenhum produto encontrado");
    
    renderizarProdutos(produtos);
  } catch (error) {
    console.error("Falha ao carregar produtos:", error);
    produtosContainer.innerHTML = `
      <div class="error">
        😕 Erro ao carregar produtos: ${error.message}
        <button onclick="carregarProdutos()">Tentar novamente</button>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", carregarProdutos);
