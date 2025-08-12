document.addEventListener('DOMContentLoaded', async function() {
    // ===== CORE STATE =====
    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem('alahliyaCart')) || [];
    let activeCategory = 'All';
    let currentPage = 'home';
    let currentPageNum = 1;
    const PRODUCTS_PER_PAGE = 8;
    let slideshowInterval;
    
    // ===== DYNAMIC CATEGORIES =====
    let CATEGORY_DATA = {};
    
    // ===== DOM ELEMENTS =====
    const sidebar = document.getElementById('sidebar');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const categoriesGrid = document.getElementById('categories-grid');
    const featuredGrid = document.getElementById('featured-products-grid');
    const productsGrid = document.getElementById('products-grid');
    const storeSearch = document.getElementById('store-search');
    const cartPanel = document.getElementById('cart-panel');
    const cartPanelContent = document.getElementById('cart-panel-content');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartCountBubble = document.getElementById('cart-count-bubble');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const loginBtn = document.getElementById('login-btn');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const backToTopBtn = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    const categoryProductsTitle = document.getElementById('category-products-title');
    const showAllBtn = document.getElementById('show-all-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const prevProductsBtn = document.getElementById('prev-products');
    const nextProductsBtn = document.getElementById('next-products');
    const pageIndicator = document.getElementById('page-indicator');
    const slideshowPrevBtn = document.querySelector('.slideshow-prev');
    const slideshowNextBtn = document.querySelector('.slideshow-next');
    const slideshowIndicators = document.querySelectorAll('.slideshow-indicator');
    
    // ===== DATA LOADING =====
    try {
    const response = await fetch('/products.csv');
    console.log("CSV loading status:", response.status, response.statusText);
    const rawData = await response.text();
    console.log("First 100 chars of CSV:", rawData.substring(0, 100));
    if (!response.ok) throw new Error('CSV load failed');
    allProducts = parseAndMapProducts(rawData);
    generateDynamicCategories();
    addEventListeners(); // ✅ ADD THIS LINE HERE
    } catch (error) {
    console.error("Loading failed, using fallback", error);
    allProducts = parseAndMapProducts(`Category,Brand,ProductName,Description,Features,SKU,Price,ImageURL
    Cleaning Chemicals,Sprayway,Sample Product,"Sample description","Sample features",SAMPLE001,10.5,sample.jpg`);
    generateDynamicCategories();
    addEventListeners(); // ✅ ADD THIS LINE HERE TOO
    }
    console.log("All products loaded:", allProducts.length, "products");
    if (allProducts.length === 0) {
        console.warn("No products found, check CSV format or path.");
    } else {
        console.log("First product:", allProducts[0]);
    }


    // ===== INITIALIZE APP =====
    init();

    function generateDynamicCategories() {
        const uniqueCategories = [...new Set(allProducts.map(p => p.Category))];
        const defaultIcons = {
            'Cleaning Machines': 'fas fa-cogs',
            'Cleaning Chemicals': 'fas fa-flask',
            'Cleaning Tools': 'fas fa-broom',
            'Waste Management': 'fas fa-trash-alt',
            'default': 'fas fa-box'
        };
        
        uniqueCategories.forEach(category => {
            const count = allProducts.filter(p => p.Category === category).length;
            CATEGORY_DATA[category] = {
                description: `${category} (${count} products)`,
                icon: defaultIcons[category] || defaultIcons['default']
            };
        });
    }

    function init() {
        renderCategories();
        renderFeaturedProducts();
        populateAboutCategories();
        updateCartUI();
        initSlideshow();
        renderProductsGrid();
        addEventListeners();
        showPage('home');
        initBackToTop();
    }

    // ===== PAGE NAVIGATION =====
    function showPage(pageName) {
        currentPage = pageName;
        pageSections.forEach(section => section.classList.remove('active'));
        document.getElementById(`${pageName}-page`).classList.add('active');
        navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageName));
        
        closeMobileSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if(pageName === 'store') {
            activeCategory = 'All';
            storeSearch.value = '';
            categoryProductsTitle.textContent = `All Products`;
            currentPageNum = 1;
            renderProductsGrid();
        }
    }
    
    // ===== SIDEBAR LOGIC =====
    function openMobileSidebar() {
        sidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('open');
        document.body.style.overflow = '';
    }            
    
    // ===== DATA PARSING =====
function parseAndMapProducts(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    // Robust CSV split — supports commas in quotes
    const values = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const product = {};
    headers.forEach((header, i) => {
      product[header] = values[i] ? values[i].replace(/"/g, '') : '';
    });

    // ✅ local image fallback logic
    if (product.ImageURL) {
      let imagePath = product.ImageURL.replace(/\\/g, '/');
      if (!imagePath.startsWith('http') && !imagePath.startsWith('./')) {
        imagePath = './' + imagePath;
      }
      product.ImageURL = imagePath;
    } else {
      product.ImageURL = './images/default-product.jpg';
    }

    return product;
  }).filter(p => p && p.SKU);
}


    // ===== RENDERING FUNCTIONS =====
    function renderCategories() {
        categoriesGrid.innerHTML = '';
        Object.keys(CATEGORY_DATA).forEach(category => {
            const count = allProducts.filter(p => p.Category === category).length;
            if (count === 0) return;
            
            const data = CATEGORY_DATA[category];
            categoriesGrid.innerHTML += `
                <div class="category-card" data-category="${category}">
                    <div class="category-content">
                        <div>
                            <div class="category-icon"><i class="${data.icon}"></i></div>
                            <h3 class="category-name">${category}</h3>
                            <p class="category-description">${data.description}</p>
                        </div>
                        <span class="category-count">${count} products</span>
                    </div>
                </div>
            `;
        });
    }

    function populateAboutCategories() {
        const list = document.getElementById('about-categories-list');
        list.innerHTML = '';
         Object.keys(CATEGORY_DATA).forEach(category => {
            const data = CATEGORY_DATA[category];
            list.innerHTML += `
                <div class="flex items-start">
                    <i class="${data.icon} text-yellow-500 mt-1 mr-3"></i>
                    <div>
                        <strong class="text-gray-800">${category}</strong> &ndash; ${data.description}.
                    </div>
                </div>
            `;
         });
    }

    function renderFeaturedProducts() {
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 8);
        featuredGrid.innerHTML = '';
        shuffled.forEach(product => {
            featuredGrid.innerHTML += createProductCard(product);
        });
    }
    
    function renderProductsGrid() {
        const filteredProducts = getFilteredProducts();
        const startIndex = (currentPageNum - 1) * PRODUCTS_PER_PAGE;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
        
        productsGrid.innerHTML = '';
        paginatedProducts.forEach(product => {
            productsGrid.innerHTML += createProductCard(product);
        });
        
        const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
        pageIndicator.textContent = `Page ${currentPageNum} of ${totalPages}`;
        
        prevProductsBtn.classList.toggle('disabled', currentPageNum === 1);
        nextProductsBtn.classList.toggle('disabled', currentPageNum === totalPages || totalPages === 0);
    }
    
    function getFilteredProducts() {
        const searchTerm = storeSearch.value.toLowerCase();
        let filteredProducts = allProducts;
        
        if (activeCategory !== 'All') {
            filteredProducts = filteredProducts.filter(p => p.Category === activeCategory);
        }
        
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.ProductName.toLowerCase().includes(searchTerm) || 
                p.Brand.toLowerCase().includes(searchTerm) ||
                p.ProductID.toLowerCase().includes(searchTerm) ||
                p.Category.toLowerCase().includes(searchTerm));
        }
        
        return filteredProducts;
    }
    
        function createProductCard(product) {
            return `
                <div class="product-card">
                    <div class="product-image">
                        <img 
                            src="${product.ImageURL}" 
                            alt="${product.ProductName}"
                            onerror="this.onerror=null; this.src='./images/default-product.jpg'"
                            loading="lazy"
                        >
                    </div>
                <div class="product-info">
                    <div>
                        <span class="product-category">${product.Category}</span>
                        <h3 class="product-name">${product.ProductName}</h3>
                    </div>
                    <div class="product-price">
                        <span class="price">KWD ${product.Price.toFixed(3)}</span>
                        <button class="add-to-cart"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function showProductDetail(productId) {
        const product = allProducts.find(p => p.ProductID === productId);
        if (!product) return;
        
        document.getElementById('product-detail-image').src = product.ImageURL;
        document.getElementById('product-brand').textContent = product.Brand;
        document.getElementById('product-name').textContent = product.ProductName;
        document.getElementById('product-price').textContent = `KWD ${product.Price.toFixed(3)}`;
        document.getElementById('product-description').textContent = product.Description;
        document.getElementById('product-sku').textContent = product.ProductID;
        document.getElementById('product-category').textContent = product.Category;
        
        const featuresList = document.getElementById('product-features');
        featuresList.innerHTML = '';
        if (product.Features) {
            product.Features.split(';').forEach(feature => {
                if (feature.trim()) featuresList.innerHTML += `<li>${feature.trim()}</li>`;
            });
        }
        
        document.getElementById('add-to-cart-detail').dataset.productId = productId;
        showPage('product-detail');
    }
    
    // ===== SLIDESHOW =====
    let currentSlide = 0;
    function initSlideshow() {
        const slides = document.querySelectorAll('.slideshow-slide');
        const indicators = document.querySelectorAll('.slideshow-indicator');
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                indicators[i].classList.toggle('active', i === index);
            });
            currentSlide = index;
        }
        
        function nextSlide() {
            showSlide((currentSlide + 1) % slides.length);
        }
        
        function handleSlideChange(newIndex) {
            clearInterval(slideshowInterval);
            showSlide(newIndex);
            slideshowInterval = setInterval(nextSlide, 5000);
        }
        
        slideshowInterval = setInterval(nextSlide, 5000);
        
        slideshowPrevBtn.addEventListener('click', () => 
            handleSlideChange((currentSlide - 1 + slides.length) % slides.length));
        
        slideshowNextBtn.addEventListener('click', nextSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => handleSlideChange(index));
        });
        
        return () => clearInterval(slideshowInterval);
    }
    
    // ===== CART LOGIC =====
    function addToCart(productId) {
        const product = allProducts.find(p => p.ProductID === productId);
        const cartItem = cart.find(item => item.ProductID === productId);
        
        if (cartItem) cartItem.quantity++;
        else cart.push({ ...product, quantity: 1 });
        
        saveCart(); 
        updateCartUI(); 
        showToast(`${product.ProductName} added to cart!`);
        
        openCartBtn.classList.add('cart-icon-shake');
        setTimeout(() => openCartBtn.classList.remove('cart-icon-shake'), 500);
    }
    
    function updateCartQuantity(productId, newQuantity) {
        const cartItem = cart.find(item => item.ProductID === productId);
        if (cartItem) { 
            newQuantity > 0 ? cartItem.quantity = newQuantity : cart = cart.filter(item => item.ProductID !== productId); 
        }
        saveCart(); 
        updateCartUI();
    }
    
    function saveCart() { 
        localStorage.setItem('alahliyaCart', JSON.stringify(cart)); 
    }
    
    function updateCartUI() { 
        renderCartItems(); 
        calculateSubtotal(); 
        updateCartCount(); 
    }
    
    function renderCartItems() {
        if (cart.length === 0) { 
            cartItemsContainer.innerHTML = `<p class="text-center text-gray-500 py-8">Your cart is empty.</p>`; 
            return; 
        }
        
        cartItemsContainer.innerHTML = cart.map(item => {
            const price = parseFloat(item.Price).toFixed(3);
            return `
            <div class="cart-item" data-product-id="${item.ProductID}">
                <div class="cart-item-info">
                    <img src="${item.ImageURL}" alt="${item.ProductName}" 
                        class="w-16 h-16 object-contain rounded-md"
                        onerror="this.src='https://placehold.co/100x100/f0f0f0/333?text=Image+Not+Found'">
                    <div class="cart-item-details">
                        <h4 class="font-semibold truncate">${item.ProductName}</h4>
                        <p class="text-gray-500">KWD ${price}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="flex items-center border rounded-md">
                        <button data-product-id="${item.ProductID}" 
                            data-action="decrease" 
                            class="quantity-btn px-2 py-1 text-lg font-bold hover:bg-gray-100">-</button>
                        <span class="px-3 py-1 border-l border-r">${item.quantity}</span>
                        <button data-product-id="${item.ProductID}" 
                            data-action="increase" 
                            class="quantity-btn px-2 py-1 text-lg font-bold hover:bg-gray-100">+</button>
                    </div>
                    <button class="remove-from-cart-btn text-red-500 hover:text-red-700 p-2">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');
    }
    
    function calculateSubtotal() { 
        cartSubtotalEl.textContent = `KWD ${cart.reduce((total, item) => total + (item.Price * item.quantity), 0).toFixed(3)}`; 
    }
    
    function updateCartCount() { 
        cartCountBubble.textContent = cart.reduce((count, item) => count + item.quantity, 0); 
    }
    
    function toggleCartPanel() {
        if (cartPanel.classList.contains('invisible')) { 
            cartPanel.classList.remove('invisible', 'opacity-0'); 
            cartPanelContent.classList.remove('translate-x-full'); 
        } else { 
            cartPanel.classList.add('opacity-0'); 
            cartPanelContent.classList.add('translate-x-full'); 
            setTimeout(() => cartPanel.classList.add('invisible'), 300); 
        }
    }
    
    function clearCart() {
        cart = [];
        saveCart();
        updateCartUI();
        showToast('Cart has been cleared');
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = `toast-notification bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transform translate-x-full opacity-0`;
        toast.textContent = message;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.classList.remove('translate-x-full', 'opacity-0'), 10);
        setTimeout(() => { 
            toast.classList.add('translate-x-full', 'opacity-0'); 
            setTimeout(() => toast.remove(), 300); 
        }, 3000);
    }
    
    function showLoginModal() {
        showModal(`<h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
            <form id="login-form">
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500" required>
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" name="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500" required>
                </div>
                <button type="submit" class="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors">Login</button>
            </form>`);
    }
    
    // ===== MODAL LOGIC =====
    function showModal(content) {
        modalBody.innerHTML = content;
        modal.classList.remove('invisible', 'opacity-0');
        modal.querySelector('#modal-content').classList.remove('scale-95');
    }
    
    function hideModal() {
        modal.classList.add('opacity-0');
        modal.querySelector('#modal-content').classList.add('scale-95');
        setTimeout(() => modal.classList.add('invisible'), 300);
    }
    
    // ===== BACK TO TOP =====
    function initBackToTop() {
        window.addEventListener('scroll', function() {
            const backToTopButton = document.getElementById('back-to-top');
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        document.getElementById('back-to-top').addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== EVENT LISTENERS =====
        function addEventListeners() {
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
            e.preventDefault();
            showPage(link.dataset.page);
            });
        });

        productsGrid.addEventListener('click', e => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
            const sku = productCard.dataset.sku;
            const product = allProducts.find(p => p.SKU === sku);
            if (product) {
                openProductModal(product);
            }
        }
        });        
        menuToggleBtn.addEventListener('click', openMobileSidebar);
        sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
        document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);
        
        storeSearch.addEventListener('input', () => {
            currentPageNum = 1;
            renderProductsGrid();
        });
        
        clearCartBtn.addEventListener('click', clearCart);
        
        document.getElementById('explore-products-btn')?.addEventListener('click', function() {
            showPage('store');
        });
        
        categoriesGrid.addEventListener('click', function(e) {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                activeCategory = categoryCard.dataset.category;
                categoryProductsTitle.textContent = `${activeCategory} Products`;
                currentPageNum = 1;
                renderProductsGrid();
                document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
            }
        });

        showAllBtn.addEventListener('click', function() {
            activeCategory = 'All';
            storeSearch.value = '';
            categoryProductsTitle.textContent = `All Products`;
            currentPageNum = 1;
            renderProductsGrid();
        });
        
        function handleProductCardClick(e) {
            const productCard = e.target.closest('.product-card');
            const addToCartBtn = e.target.closest('.add-to-cart');
            
            if (!productCard) return;
            
            const productId = productCard.dataset.productId;
            if (addToCartBtn) {
                e.stopPropagation();
                addToCart(productId);
            } else {
                showProductDetail(productId);
            }
        }
        
        let navigationHistory = [];

        function saveCurrentState() {
            navigationHistory.push({
                category: activeCategory,
                search: storeSearch.value,
                page: currentPageNum,
                title: categoryProductsTitle.textContent,
                scrollY: window.scrollY
            });
        }

        const originalShowProductDetail = showProductDetail;
        showProductDetail = function(productId) {
            saveCurrentState();
            originalShowProductDetail(productId);
        };

        document.getElementById('back-to-store').addEventListener('click', function(e) {
            e.preventDefault();
            if (navigationHistory.length > 0) {
                const lastState = navigationHistory.pop();
                
                document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
                document.getElementById('store-page').classList.add('active');
                
                activeCategory = lastState.category;
                storeSearch.value = lastState.search;
                currentPageNum = lastState.page;
                categoryProductsTitle.textContent = lastState.title;
                
                renderProductsGrid();
                
                requestAnimationFrame(() => {
                    window.scrollTo(0, lastState.scrollY);
                });
            } else {
                showPage('store');
            }
        });                    

        document.getElementById('main-content').addEventListener('click', handleProductCardClick);           
        document.getElementById('add-to-cart-detail').addEventListener('click', function() { 
            addToCart(this.dataset.productId); 
        });
        
        openCartBtn.addEventListener('click', toggleCartPanel);
        closeCartBtn.addEventListener('click', toggleCartPanel);
        cartPanel.addEventListener('click', e => { 
            if (e.target === cartPanel) toggleCartPanel() 
        });
        
        cartItemsContainer.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (!button) return;
            const productId = button.closest('[data-product-id]').dataset.productId;
            if (!productId) return;
            
            if (button.classList.contains('remove-from-cart-btn')) { 
                updateCartQuantity(productId, 0); 
            } else if (button.classList.contains('quantity-btn')) {
                const action = button.dataset.action;
                const cartItem = cart.find(item => item.ProductID === productId);
                if (!cartItem) return;
                let newQuantity = cartItem.quantity + (action === 'increase' ? 1 : -1);
                updateCartQuantity(productId, newQuantity);
            }
        });

        loginBtn.addEventListener('click', showLoginModal);
        modal.addEventListener('submit', e => { 
            if (e.target.id === 'login-form') { 
                e.preventDefault(); 
                hideModal(); 
                showToast('Login successful! Welcome back.'); 
            }
        });
        
        closeModalBtn.addEventListener('click', hideModal);
        modal.addEventListener('click', e => { 
            if (e.target === modal) hideModal() 
        });
        
        document.querySelectorAll('.home-link').forEach(link => link.addEventListener('click', e => { 
            e.preventDefault(); 
            showPage('home'); 
        }));
        
        function handlePrevPage() {
            if (currentPageNum > 1) {
                currentPageNum--;
                renderProductsGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        function handleNextPage() {
            const filteredProducts = getFilteredProducts();
            const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
            if (currentPageNum < totalPages) {
                currentPageNum++;
                renderProductsGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        
        prevProductsBtn.addEventListener('click', handlePrevPage);
        nextProductsBtn.addEventListener('click', handleNextPage);
    }
});