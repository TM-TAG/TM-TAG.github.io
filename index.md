---
layout: default
title: Home
---

<!-- Home Page -->
<section id="home-page" class="page-section active">
  <div class="slideshow-container">
    <!-- Slides -->
    <div class="slideshow-slide" style="background-image: url('https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070')"></div>
    <div class="slideshow-slide" style="background-image: url('https://images.unsplash.com/photo-1591872203534-278fc084969e?q=80&w=2064')"></div>
    <div class="slideshow-slide active" style="background-image: url('https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1932')"></div>

    <!-- Slideshow nav -->
    <button class="slideshow-nav slideshow-prev">
      <i class="fas fa-chevron-left"></i>
    </button>
    <button class="slideshow-nav slideshow-next">
      <i class="fas fa-chevron-right"></i>
    </button>

    <div class="slideshow-indicators">
      <div class="slideshow-indicator active" data-index="0"></div>
      <div class="slideshow-indicator" data-index="1"></div>
      <div class="slideshow-indicator" data-index="2"></div>
    </div>
  </div>

  <div class="text-center mb-12">
    <h1 class="text-brand font-body text-4xl shadow-glow">
      Welcome to Al-Ahliya Int. ✨
    </h1>

    <p class="text-xl max-w-3xl mx-auto mb-6">
      Your trusted partner for premium cleaning solutions in Kuwait. We provide top-quality products for residential, commercial, and industrial needs.
    </p>
    <button id="explore-products-btn" class="bg-yellow-500 text-white px-6 py-3 rounded-full font-bold hover:bg-yellow-600 transition-colors">
      Explore Our Products
    </button>
  </div>

  <h2 class="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>

  <div class="shop-grid" id="featured-products-grid">
    <!-- Filled dynamically by JS -->
  </div>
</section>

<!-- Store Page -->
<section id="store-page" class="page-section">
  <div id="categories-section">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">Product Categories</h2>
    <div class="shop-grid" id="categories-grid"></div>
  </div>

  <div class="store-search-container">
    <i class="fas fa-search"></i>
    <input type="search" id="store-search" placeholder="Search all products..." class="w-full">
  </div>

  <div id="products-section" class="mt-8">
    <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
      <h3 id="category-products-title" class="text-2xl font-bold text-gray-700">All Products</h3>
      <div class="flex items-center gap-4">
        <button id="show-all-btn" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold">Show All</button>
        <div class="pagination-controls">
          <button id="prev-products" class="pagination-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span id="page-indicator" class="page-indicator">Page 1 of 1</span>
          <button id="next-products" class="pagination-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ THIS is your dynamic grid container -->
    <div class="shop-grid" id="products-grid"></div>
  </div>
</section>


<!-- About Page -->
<section id="about-page" class="page-section">
  <div class="bg-white p-6 md:p-8 rounded-lg shadow-lg about-content">
    <h1 class="text-3xl md:text-4xl font-extrabold text-center text-yellow-500 mb-8">
      <span class="text-2xl md:text-3xl font-medium">About</span> Al-Ahliya<span class="text-gray-800"> INT.</span>
    </h1>
    <div class="text-lg space-y-6 text-gray-700">
      <p class="text-xl">
        Al-Ahliya Int is a leading provider of professional cleaning equipment and supplies, based in Al-Farwaniya, Al-Dajeej – Block 1, Parcel 43, 1st Floor, Office 6, Kuwait.
      </p>
      <p>
        Founded in 2005, we have earned a strong reputation for delivering high-quality cleaning solutions for residential, commercial, and industrial needs.
      </p>
      <div id="about-categories-list" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"></div>
      <p>
        At Al-Ahliya Int, we pride ourselves on our highly trained team, reliable service, and customer-first values.
      </p>
    </div>
  </div>
</section>

<!-- Product Detail Page -->
<section id="product-detail-page" class="page-section">
  <a class="back-button" id="back-to-store">
    <i class="fas fa-arrow-left"></i> Back to Store
  </a>
  <div class="product-detail-grid">
    <div>
      <img id="product-detail-image" src="" alt="Product" class="w-full rounded-lg shadow-lg">
    </div>
    <div>
      <p id="product-brand" class="text-sm uppercase text-gray-500 mb-2">Brand</p>
      <h1 id="product-name" class="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Product Name</h1>
      <p id="product-price" class="text-3xl font-light text-yellow-600 mb-6">KWD 0.000</p>
      <p id="product-description" class="text-gray-700 leading-relaxed mb-6">Product description.</p>
      <div class="border-t pt-6">
        <h3 class="text-xl font-semibold mb-3">Key Features</h3>
        <ul id="product-features" class="list-disc list-inside text-gray-600 space-y-2"></ul>
      </div>
      <div class="border-t mt-6 pt-6">
        <p class="text-gray-500"><span class="font-semibold">SKU:</span> <span id="product-sku">N/A</span></p>
        <p class="text-gray-500"><span class="font-semibold">Category:</span> <span id="product-category">N/A</span></p>
      </div>
      <div class="mt-8">
        <button class="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-lg" id="add-to-cart-detail">
          <i class="fas fa-shopping-cart mr-2"></i> Add to Cart
        </button>
      </div>
    </div>
  </div>
</section>
