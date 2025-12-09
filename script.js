// TESTE CRÍTICO: SE ESTA MENSAGEM APARECER, O JS ESTÁ A FUNCIONAR


// =======================================================
// CÓDIGO DO CARRINHO
// =======================================================

// Array para armazenar os itens do carrinho
let cart = [];

// Função para formatar o preço (para exibição com "Kz")
const formatPrice = (price) => {
    return price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');
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
            <span>${formatPrice(item.price)} 
                <span class="item-remove" data-index="${index}">[X]</span>
            </span>
        `;
        cartList.appendChild(listItem);
    });

    totalPriceElement.textContent = formatPrice(totalPrice);
};

// Função para adicionar um item ao carrinho
const addItemToCart = (name, price) => {
    cart.push({ name, price });
    updateCartDisplay();
};

// Função para remover um item do carrinho
const removeItemFromCart = (index) => {
    cart.splice(index, 1);
    updateCartDisplay();
};

// Adiciona event listeners aos botões
const addButtons = document.querySelectorAll('.add-to-cart');
addButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const itemElement = event.target.closest('.menu-item');
        
        if (!itemElement) return;

        const name = itemElement.getAttribute('data-name');
        const price = parseInt(itemElement.getAttribute('data-price'));

        addItemToCart(name, price);
        alert(`${name} adicionado ao pedido!`);
    });
});

const checkoutButton = document.getElementById('checkout-btn');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione itens antes de finalizar.');
            return;
        }
        
        const orderDetails = cart.map((item, index) => {
            return `${index + 1}. ${item.name} (${formatPrice(item.price)})`;
        }).join('\n');

        const totalMessage = document.getElementById('total-price').textContent;

        const finalMessage = `
Olá! Tenho um pedido para o Quintal dos Sabores:

*PRATOS*
${orderDetails}

*TOTAL:* ${totalMessage}

Por favor, confirme a encomenda e o endereço de entrega (Sassamba, Rua da Vala, Saurimo).
`;
        
        const whatsappNumber = '929287834';
        const encodedMessage = encodeURIComponent(finalMessage.trim());
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`; 
        
        window.open(whatsappLink, '_blank');

        alert('Seu pedido foi enviado para o WhatsApp! Por favor, finalize a conversa lá.');
        cart = [];
        updateCartDisplay();
    });
}

const cartListElement = document.getElementById('cart-list');
if (cartListElement) {
    cartListElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('item-remove')) {
            const indexToRemove = parseInt(event.target.getAttribute('data-index'));
            removeItemFromCart(indexToRemove);
        }
    });
}