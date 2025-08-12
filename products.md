---
layout: default
title: Our Products
---

<h1 class="text-3xl font-bold mb-8">Our Product Catalog</h1>

<!-- ✅ Liquid loop -->
<div class="shop-grid">
  {% for product in site.data.products %}
  <div class="product-card">
    <div class="product-image">
      <img src="{{ product.ImageURL | relative_url }}" alt="{{ product.ProductName }}">
    </div>
    <div class="product-info">
      <span class="product-category">{{ product.Category }}</span>
      <h3 class="product-name">{{ product.ProductName }}</h3>
      <div class="product-price">
        <span class="price">KWD {{ product.Price }}</span>
      </div>
    </div>
  </div>
  {% endfor %}
</div>
