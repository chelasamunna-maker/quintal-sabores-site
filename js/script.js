// CÓDIGO DO CARRINHO (Funcionalidade)

let cart = []; // Array para armazenar os itens do carrinho

// Função para formatar o preço (CORRIGIDA para formato Kz)
const formatPrice = (price) => {
    // Garante que o separador de milhar seja um ponto e a moeda Kz
    return price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 }).replace('AOA', 'Kz');
};

// Função para atualizar a visualização do carrinho
const updateCartDisplay = () => {
    const cartList = document.getElementById('cart-list');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartList || !totalPriceElement) return;

    cartList.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart-message">(Carrinho vazio)</li>';
        totalPriceElement.textContent = formatPrice(0);
        return;
    }

    cart.forEach((item, index) => {
        totalPrice += item.price;
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.name}</span>
            <span class="item-price-cart">${formatPrice(item.price)}</span>
            <button class="remove-item-btn" data-index="${index}">[X]</button>
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

// Função para remover um item do carrinho
const removeItemFromCart = (index) => {
    cart.splice(index, 1);
    updateCartDisplay();
};

// Função para gerar a mensagem do WhatsApp
const generateWhatsAppMessage = () => {
    if (cart.length === 0) {
        alert('O seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
        return;
    }

    let message = "Olá, gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `* ${item.name}: ${formatPrice(item.price)}\n`;
        total += item.price;
    });

    message += `\n*Total a Pagar:* ${formatPrice(total)}\n\n`;
    message += "Por favor, confirme a disponibilidade e o prazo de entrega. Obrigado!";

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
    updateCartDisplay();

    // Event listeners para os botões "Adicionar ao Pedido"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.menu-item');
            const name = itemElement.dataset.name;
            // Garante que o preço é lido como número inteiro
            const price = parseInt(itemElement.dataset.price); 
            addToCart(name, price);
        });
    });

    // Event listener para remover itens do carrinho (DELEGAÇÃO)
    const cartList = document.getElementById('cart-list');
    if (cartList) {
        cartList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                const index = parseInt(e.target.dataset.index);
                removeItemFromCart(index);
            }
        });
    }

    // Event listener para o botão "Finalizar Encomenda (WhatsApp)"
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', generateWhatsAppMessage);
    }
});
