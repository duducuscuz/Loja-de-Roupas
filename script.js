const iconeCarrinho = document.getElementById('icone-carrinho');
const carrinhoElement = document.getElementById('carrinho');
const contadorCarrinho = document.getElementById('contador-carrinho');
const listaCarrinho = document.getElementById('lista-carrinho');
const total = document.getElementById('total');
const fecharCarrinho = document.getElementById('fechar-carrinho');

const detalhesProduto = document.getElementById('detalhes-produto');
const nomeProdutoDetalhe = document.getElementById('nome-produto-detalhe');
const precoProdutoDetalhe = document.getElementById('preco-produto-detalhe');
const opcoesProduto = document.getElementById('opcoes-produto');
const pagamentoProduto = document.getElementById('pagamento-produto');
const fecharDetalhes = document.getElementById('fechar-detalhes');

const carrinho = [];

iconeCarrinho.addEventListener('click', () => {
    carrinhoElement.classList.toggle('ativo');

    if (carrinhoElement.classList.contains('ativo')) {
        iconeCarrinho.style.display = 'none';
        console.log('Ícone do carrinho oculto');
    } else {
        iconeCarrinho.style.display = 'block';
        console.log('Ícone do carrinho exibido');
    }
});

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
}

function removerDoCarrinho(itemRemover) {
    const index = carrinho.findIndex(item => item === itemRemover);
    if (index !== -1) {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    }
}

function atualizarCarrinho() {
    listaCarrinho.innerHTML = '';
    let precoTotal = 0;

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;

        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.addEventListener('click', () => removerDoCarrinho(item));
        li.appendChild(botaoRemover);

        listaCarrinho.appendChild(li);
        precoTotal += item.preco;
    });

    total.textContent = `Total: R$ ${precoTotal.toFixed(2)}`;
    contadorCarrinho.textContent = carrinho.length;
}

fecharCarrinho.addEventListener('click', () => {
    carrinhoElement.classList.remove('ativo');
    iconeCarrinho.style.display = 'block';
});

const botoesComprar = document.querySelectorAll('.roupa-item .adicionar-carrinho');
botoesComprar.forEach((botao, index) => {
    botao.addEventListener('click', () => {
        const nome = document.querySelectorAll('.roupa-item h3')[index].textContent;
        const preco = parseFloat(document.querySelectorAll('.roupa-item .preco')[index].textContent.replace('R$ ', ''));
        adicionarAoCarrinho(nome, preco);
    });
});

const API_URL = 'URL_DA_SUA_API_DE_PAGAMENTO';
const API_KEY = 'SUA_CHAVE_DE_API';

async function gerarQRCodePix(valor, identificacaoPedido) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({ valor, identificacaoPedido })
        });

        if (!response.ok) {
            throw new Error('Falha ao gerar QR code Pix');
        }

        const data = await response.json();
        return data.qrcode;
    } catch (error) {
        console.error('Erro ao gerar QR code Pix:', error);
        alert('Falha ao gerar QR code Pix. Tente novamente mais tarde.');
        return null;
    }
}

document.getElementById('finalizar-compra').addEventListener('click', async () => {
    const valorTotal = calcularValorTotal();
    const identificacaoPedido = gerarIdentificacaoPedido();

    const qrcode = await gerarQRCodePix(valorTotal, identificacaoPedido);
    if (qrcode) {
        document.getElementById('qrcode-container').innerHTML = `<img src="${qrcode}" alt="QR Code Pix">`;
    }
});

function calcularValorTotal() {
    return carrinho.reduce((total, item) => total + item.preco, 0);
}

function gerarIdentificacaoPedido() {
    return `PEDIDO-${Date.now()}`;
}

const roupas = [
    {
        nome: 'Blusa Estampada',
        preco: 49.99,
        imagem: 'blusa1.jpg',
        detalhes: 'Blusa estampada com tecido leve e confortável. Ideal para looks casuais e despojados.',
        tamanhos: ['P', 'M', 'G'],
        cores: ['Azul', 'Vermelho', 'Verde'],
        pagamentos: ['Cartão de crédito', 'Boleto bancário', 'Pix']
    },
    {
        nome: 'Calça Jeans',
        preco: 89.99,
        imagem: 'calca1.jpg',
        detalhes: 'Calça jeans com modelagem moderna e confortável. Perfeita para o dia a dia e para ocasiões especiais.',
        tamanhos: ['36', '38', '40', '42'],
        cores: ['Azul', 'Preto'],
        pagamentos: ['Cartão de crédito', 'Pix']
    },
    {
        nome: 'Vestido Floral',
        preco: 129.99,
        imagem: 'vestido1.jpg',
        detalhes: 'Vestido floral com tecido leve e fluido. Ideal para eventos e ocasiões especiais.',
        tamanhos: ['P', 'M', 'G'],
        cores: ['Estampado'],
        pagamentos: ['Cartão de crédito', 'Boleto bancário']
    },
    {
        nome: 'Saia Midi',
        preco: 79.99,
        imagem: 'saia1.jpg',
        detalhes: 'Saia midi com tecido leve e confortável. Ideal para looks casuais e elegantes.',
        tamanhos: ['P', 'M', 'G'],
        cores: ['Preto', 'Branco'],
        pagamentos: ['Cartão de crédito', 'Pix']
    },
    {
        nome: 'Colar Dourado',
        preco: 39.99,
        imagem: 'acessorio1.jpg',
        detalhes: 'Colar dourado com design moderno e elegante. Perfeito para complementar looks diversos.',
        tamanhos: ['Único'],
        cores: ['Dourado'],
        pagamentos: ['Cartão de crédito', 'Pix']
    }
];


const botoesDetalhes = document.querySelectorAll('.roupa-item .detalhes-produto');

botoesDetalhes.forEach(botao => {
    botao.addEventListener('click', () => {
        const index = botao.parentElement.dataset.index;
        const roupa = roupas[index];

        detalhesProduto.style.display = 'block';

        nomeProdutoDetalhe.textContent = roupa.nome;
        precoProdutoDetalhe.textContent = `R$ ${roupa.preco.toFixed(2)}`;

        opcoesProduto.innerHTML = `
            <label for="tamanho">Tamanho:</label>
            <select id="tamanho">
                ${roupa.tamanhos.map(tamanho => `<option value="${tamanho}">${tamanho}</option>`).join('')}
            </select>
            <label for="cor">Cor:</label>
            <select id="cor">
                ${roupa.cores.map(cor => `<option value="${cor}">${cor}</option>`).join('')}
            </select>
        `;

        pagamentoProduto.innerHTML = `
            <p>Formas de pagamento:</p>
            <ul>
                ${roupa.pagamentos.map(pagamento => `<li>${pagamento}</li>`).join('')}
            </ul>
        `;
    });
});

fecharDetalhes.addEventListener('click', () => {
    detalhesProduto.style.display = 'none';
});

// Busca
const campoBusca = document.getElementById('campo-busca');
const botaoBusca = document.getElementById('botao-busca');

botaoBusca.addEventListener('click', () => {
    const termoBusca = campoBusca.value.toLowerCase();
    const roupas = document.querySelectorAll('.roupa-item');

    roupas.forEach(roupa => {
        const nomeRoupa = roupa.querySelector('h3').textContent.toLowerCase();
        if (nomeRoupa.includes(termoBusca)) {
            roupa.style.display = 'block';
        } else {
            roupa.style.display = 'none';
        }
    });
});

// Filtros
const filtroPreco = document.getElementById('filtro-preco');

filtroPreco.addEventListener('change', () => {
    const valorFiltro = filtroPreco.value;
    const roupas = document.querySelectorAll('.roupa-item');

    roupas.forEach(roupa => {
        const precoRoupa = parseFloat(roupa.querySelector('.preco').textContent.replace('R$ ', ''));
        if (valorFiltro === 'todos' ||
            (valorFiltro === 'menor-50' && precoRoupa < 50) ||
            (valorFiltro === '50-100' && precoRoupa >= 50 && precoRoupa <= 100) ||
            (valorFiltro === 'maior-100' && precoRoupa > 100)) {
            roupa.style.display = 'block';
        } else {
            roupa.style.display = 'none';
        }
    });
});

const botoesCategoria = document.querySelectorAll('nav button');

botoesCategoria.forEach(botao => {
    botao.addEventListener('click', () => {
        const categoria = botao.dataset.categoria;
        const roupas = document.querySelectorAll('.roupa-item');

        roupas.forEach(roupa => {
            if (categoria === 'todos' || roupa.dataset.categoria === categoria) {
                roupa.style.display = 'block';
            } else {
                roupa.style.display = 'none';
            }
        });
    });
});


const botaoMenuCategorias = document.getElementById('botao-menu-categorias');
const menuCategorias = document.querySelector('.categorias');

botaoMenuCategorias.addEventListener('click', () => {
    menuCategorias.classList.toggle('ativo');
});
