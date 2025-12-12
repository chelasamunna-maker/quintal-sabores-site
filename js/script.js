// CÓDIGO DO CARRINHO (Funcionalidade com Agrupamento por Quantidade e Checkout)

let cart = []; // Array para armazenar os itens do carrinho

// Função para formatar o preço
const formatPrice = (price) => {
    return price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 }).replace('AOA', 'Kz');
};

// Função para agrupar e calcular o total do carrinho
const calculateCartSummary = () => {
    const summary = {};
    let totalPrice = 0;

    cart.forEach(item => {
        // Usa o nome e preço como chave para garantir que itens com preços diferentes não se misturem (embora improvável neste menu)
        const key = `${item.name}-${item.price}`; 
        if (!summary[key]) {
            summary[key] = {
                name: item.name,
                price: item.price,
                quantity: 0,
                totalItemPrice: 0
            };
        }
        summary[key].quantity += 1;
        summary[key].totalItemPrice += item.price;
        totalPrice += item.price;
    });

    return { summary: Object.values(summary), totalPrice };
};

// Função para atualizar a visualização do carrinho (mostra N vezes o item)
const updateCartDisplay = () => {
    const cartList = document.getElementById('cart-list');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartList || !totalPriceElement) return;

    const { summary, totalPrice } = calculateCartSummary();

    cartList.innerHTML = '';

    if (summary.length === 0) {
        cartList.innerHTML = '<li class="empty-cart-message">(Carrinho vazio)</li>';
        totalPriceElement.textContent = formatPrice(0);
        return;
    }

    summary.forEach(item => {
        const listItem = document.createElement('li');
        // Exibe: 2x Funge com Carne
        listItem.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span class="item-price-cart">${formatPrice(item.totalItemPrice)}</span>
            <button class="remove-item-btn" data-name="${item.name}" data-price="${item.price}">[X]</button>
        `;
        cartList.appendChild(listItem);
    });

    totalPriceElement.textContent = formatPrice(totalPrice);
};

// Função para adicionar um item ao carrinho
const addToCart = (name, price) => {
    cart.push({ name, price });
    updateCartDisplay();
};

// Função para remover uma UNIDADE do item do carrinho
const removeItemFromCart = (nameToRemove, priceToRemove) => {
    const index = cart.findIndex(item => item.name === nameToRemove && item.price === priceToRemove);
    if (index !== -1) {
        cart.splice(index, 1); // Remove apenas uma unidade
        updateCartDisplay();
    }
};

// Função para gerar a mensagem do WhatsApp (PERGUNTA SOBRE A ENTREGA/LEVANTAMENTO)
const generateWhatsAppMessage = () => {
    const { summary, totalPrice } = calculateCartSummary();

    if (summary.length === 0) {
        alert('O seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
        return;
    }

    // Pergunta sobre o método de recebimento
    let deliveryOption;
    
    const response = prompt(
        "Como deseja receber o seu pedido? \n\n1: Entrega ao Domicílio \n2: Levantamento/Take Away (No Restaurante) \n\nPor favor, digite 1 ou 2.", 
        "1" 
    );
    
    if (response === '2') {
        deliveryOption = "Levantamento (Take Away) no Restaurante";
    } else if (response === '1') {
        deliveryOption = "Entrega ao Domicílio";
    } else {
        alert("Opção inválida. Por favor, tente novamente. A mensagem não será enviada.");
        return; 
    }
    
    // Constrói a mensagem
    let message = "Olá, gostaria de fazer o seguinte pedido:\n\n";
    
    // 1. Informação do Tipo de Recebimento
    message += `*MODO DE RECEBIMENTO:* ${deliveryOption}\n`;
    
    // Se for entrega, pede a morada imediatamente
    if (response === '1') {
        message += `*MORADA DE ENTREGA:* [Por favor, insira a sua morada]\n`;
    }
    
    message += "\n";

    // 2. Lista dos Itens (agrupados por quantidade)
    summary.forEach(item => {
        message += `* ${item.quantity}x ${item.name}: ${formatPrice(item.totalItemPrice)}\n`;
    });

    // 3. Total e Notas
    message += `\n*Total a Pagar:* ${formatPrice(totalPrice)}\n\n`;
    
    // Instruções finais baseadas na escolha
    if (response === '1') {
        message += "Por favor, confirme o valor da taxa de entrega e a morada exata para o envio.\n\n";
    } else {
        message += "Por favor, confirme o horário para o levantamento.\n\n";
    }
    
    message += "Obrigado!";

    // Número de contato (Angola)
    const phoneNumber = "929287834"; 
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir o WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};

// =======================================================
// INICIALIZAÇÃO DE EVENT LISTENERS (Ao carregar a página)
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Atualiza o display inicial do carrinho (caso haja algo salvo)
    updateCartDisplay();

    // 2. Adiciona o listener para os botões "Adicionar ao Pedido"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.menu-item');
            const name = itemElement.dataset.name;
            const price = parseInt(itemElement.dataset.price); 
            addToCart(name, price);
        });
    });

    // 3. Adiciona o listener para os botões "[X]" (remover item)
    const cartList = document.getElementById('cart-list');
    if (cartList) {
        cartList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                const nameToRemove = e.target.dataset.name;
                const priceToRemove = parseInt(e.target.dataset.price);
                removeItemFromCart(nameToRemove, priceToRemove);
            }
        });
    }

    // 4. Adiciona o listener para o botão "Finalizar Encomenda (WhatsApp)"
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', generateWhatsAppMessage);
    }
});
