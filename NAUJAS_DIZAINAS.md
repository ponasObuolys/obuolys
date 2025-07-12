# 🎨 NAUJAS DIZAINAS - "PONAS OBUOLYS" 2025

> **Modernus, profesionalus AI švietimo platformos dizainas**  
> Transformacija į aukščiausio lygio, vizualiai stulbinančią svetainę

---

## 📋 **TURINYS**
1. [Bendras Konceptas](#bendras-konceptas)
2. [Spalvų Paletė](#spalvų-paletė)
3. [Tipografija](#tipografija)
4. [Komponentų Sistema](#komponentų-sistema)
5. [Layout Modernizacija](#layout-modernizacija)
6. [Animacijos ir Efektai](#animacijos-ir-efektai)
7. [Homepage Redesign](#homepage-redesign)
8. [Admin Panel Transformation](#admin-panel-transformation)
9. [Responsive Design](#responsive-design)
10. [Implementacijos Planas](#implementacijos-planas)

---

## 🎯 **BENDRAS KONCEPTAS**

### **Dizaino Filosofija**
- **Premium AI Platform**: Aukščiausio lygio profesionalumas
- **Lithuanian Tech Innovation**: Lietuviška technologijų inovacija
- **Educational Excellence**: Švietimo kokybė ir prieinamumas
- **Future-Forward**: Ateities technologijų estetika

### **Dizaino Stilius**
- **Glassmorphism + Neumorphism Hybrid**: Stikliškumas su minkštais šešėliais
- **AI-Inspired Aesthetics**: Dirbtinio intelekto tematika
- **Minimalistic Luxury**: Minimalistinis prabangumas
- **Interactive & Dynamic**: Interaktyvūs ir dinaminiai elementai

---

## 🌈 **SPALVŲ PALETĖ**

### **Pagrindinės Spalvos**
```css
/* Primary - AI Blue Gradient */
--primary-50:  #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;  /* Main blue */
--primary-600: #2563eb;
--primary-700: #1d4ed8;
--primary-900: #1e3a8a;

/* Secondary - Neural Purple */
--secondary-50:  #faf5ff;
--secondary-100: #f3e8ff;
--secondary-500: #8b5cf6;  /* Main purple */
--secondary-600: #7c3aed;
--secondary-700: #6d28d9;
--secondary-900: #4c1d95;

/* Accent - Tech Green */
--accent-50:  #ecfdf5;
--accent-100: #d1fae5;
--accent-500: #10b981;  /* Main green */
--accent-600: #059669;
--accent-700: #047857;
--accent-900: #064e3b;
```

### **Gradient Combinations**
```css
/* Hero Gradient */
--gradient-hero: linear-gradient(135deg, 
  #667eea 0%, 
  #764ba2 25%, 
  #f093fb 50%, 
  #f5576c 75%, 
  #4facfe 100%);

/* AI Mesh Gradient */
--gradient-ai: radial-gradient(circle at 20% 50%, 
  rgba(120, 119, 198, 0.3) 0%, 
  transparent 50%), 
  radial-gradient(circle at 80% 20%, 
  rgba(255, 119, 198, 0.3) 0%, 
  transparent 50%), 
  radial-gradient(circle at 40% 70%, 
  rgba(59, 130, 246, 0.4) 0%, 
  transparent 50%);

/* Glass Morphism */
--glass-bg: rgba(255, 255, 255, 0.25);
--glass-border: rgba(255, 255, 255, 0.18);
--glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
```

### **Dark Mode Spalvos**
```css
/* Dark Background */
--dark-bg-primary: #0f0f23;
--dark-bg-secondary: #16213e;
--dark-bg-tertiary: #1a2332;

/* Dark Glassmorphism */
--dark-glass-bg: rgba(255, 255, 255, 0.05);
--dark-glass-border: rgba(255, 255, 255, 0.1);
--dark-glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
```

---

## ✍️ **TIPOGRAFIJA**

### **Font Stack**
```css
/* Primary Font - Inter (Modern Sans-Serif) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Display Font - Space Grotesk (Headlines) */
--font-display: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;

/* Mono Font - JetBrains Mono (Code) */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### **Typography Scale**
```css
/* Display Text */
--text-display-2xl: 4.5rem;   /* 72px */
--text-display-xl:  3.75rem;  /* 60px */
--text-display-lg:  3rem;     /* 48px */

/* Headers */
--text-h1: 2.25rem;  /* 36px */
--text-h2: 1.875rem; /* 30px */
--text-h3: 1.5rem;   /* 24px */
--text-h4: 1.25rem;  /* 20px */

/* Body */
--text-lg: 1.125rem; /* 18px */
--text-base: 1rem;   /* 16px */
--text-sm: 0.875rem; /* 14px */
--text-xs: 0.75rem;  /* 12px */
```

### **Font Weights**
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

---

## 🧩 **KOMPONENTŲ SISTEMA**

### **1. Glassmorphism Card**
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px 0 rgba(31, 38, 135, 0.5);
}
```

### **2. Neumorphism Buttons**
```css
.neuro-button {
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  box-shadow: 
    20px 20px 40px #d1d1d1,
    -20px -20px 40px #ffffff;
  border-radius: 16px;
  border: none;
  transition: all 0.3s ease;
}

.neuro-button:hover {
  transform: scale(1.02);
  box-shadow: 
    25px 25px 50px #c8c8c8,
    -25px -25px 50px #ffffff;
}

.neuro-button:active {
  transform: scale(0.98);
  box-shadow: inset 10px 10px 20px #d1d1d1,
              inset -10px -10px 20px #ffffff;
}
```

### **3. Floating Navigation**
```css
.floating-nav {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  padding: 12px 24px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  z-index: 1000;
}
```

### **4. Modern Input Fields**
```css
.modern-input {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.modern-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.modern-input::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent);
  transition: left 0.5s;
}

.modern-input:focus::before {
  left: 100%;
}
```

### **5. Animated Icons**
```css
.icon-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-hover:hover {
  transform: translateY(-2px) scale(1.1);
  filter: drop-shadow(0 8px 16px rgba(59, 130, 246, 0.3));
}

/* Rotating Animation */
.icon-rotate {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 🏗️ **LAYOUT MODERNIZACIJA**

### **1. Container System**
```css
.container-fluid {
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.container-wide {
  max-width: 1440px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}
```

### **2. Grid System**
```css
.grid {
  display: grid;
  gap: 24px;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Auto-fit responsive grid */
.grid-auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```

### **3. Spacing System**
```css
/* Consistent spacing scale */
.space-1 { margin: 4px; }
.space-2 { margin: 8px; }
.space-3 { margin: 12px; }
.space-4 { margin: 16px; }
.space-6 { margin: 24px; }
.space-8 { margin: 32px; }
.space-12 { margin: 48px; }
.space-16 { margin: 64px; }
.space-20 { margin: 80px; }
.space-24 { margin: 96px; }
```

---

## ✨ **ANIMACIJOS IR EFEKTAI**

### **1. Page Transitions**
```css
/* Page enter animation */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Stagger children animations */
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### **2. Scroll Animations**
```css
/* Parallax elements */
.parallax-slow {
  transform: translateY(var(--scroll-y, 0) * 0.5px);
}

.parallax-fast {
  transform: translateY(var(--scroll-y, 0) * -0.3px);
}

/* Reveal on scroll */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

### **3. Micro-interactions**
```css
/* Button press effect */
.button-press {
  transition: all 0.1s ease;
}

.button-press:active {
  transform: scale(0.95);
}

/* Loading pulse */
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, 
    #f0f0f0 25%, 
    #e0e0e0 50%, 
    #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### **4. Particle System**
```css
/* Floating particles background */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, 
    rgba(59, 130, 246, 0.8) 0%, 
    transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-20px) scale(1.1);
    opacity: 0.8;
  }
}
```

---

## 🏠 **HOMEPAGE REDESIGN**

### **1. Hero Section - Complete Redesign**
```jsx
<section className="hero-section">
  {/* Animated Background */}
  <div className="hero-background">
    <div className="gradient-mesh"></div>
    <div className="particles-container">
      {/* Floating particles */}
    </div>
  </div>

  {/* Main Content */}
  <div className="hero-content">
    <div className="glass-card hero-card">
      <h1 className="hero-title">
        <span className="gradient-text">Dirbtinis Intelektas</span>
        <br />
        <span className="text-secondary">Lietuvos Švietimui</span>
      </h1>
      
      <p className="hero-description">
        Moderniausi AI įrankiai, kursai ir žinios lietuvių kalba. 
        Mokykitės iš geriausiųjų ir tapkite AI ekspertais.
      </p>

      <div className="hero-actions">
        <button className="btn-primary-gradient">
          <span>Pradėti mokytis</span>
          <Icon name="rocket" className="ml-2" />
        </button>
        
        <button className="btn-secondary-glass">
          <Icon name="play" className="mr-2" />
          <span>Žiūrėti demo</span>
        </button>
      </div>

      {/* Stats Counter */}
      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Studentų</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Įrankių</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">20+</div>
          <div className="stat-label">Kursų</div>
        </div>
      </div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="scroll-indicator">
    <div className="scroll-icon"></div>
  </div>
</section>
```

### **2. Features Section - Interactive Cards**
```jsx
<section className="features-section">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title gradient-text">
        Kodėl Ponas Obuolys?
      </h2>
      <p className="section-description">
        Unikalūs pranašumai, kurie padės jums tapti AI ekspertu
      </p>
    </div>

    <div className="features-grid">
      {features.map((feature, index) => (
        <div key={index} className="feature-card glass-card">
          <div className="feature-icon-container">
            <div className="feature-icon-bg"></div>
            <Icon 
              name={feature.icon} 
              className="feature-icon"
            />
          </div>
          
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-description">{feature.description}</p>
          
          <div className="feature-accent"></div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### **3. Tools Section - Masonry Layout**
```jsx
<section className="tools-section">
  <div className="container-wide">
    <div className="section-header">
      <h2 className="section-title">
        Rekomenduojami <span className="gradient-text">Įrankiai</span>
      </h2>
      <p className="section-description">
        Geriausi AI įrankiai, kuriuos naudoja profesionalai
      </p>
    </div>

    <div className="tools-masonry">
      {tools.map((tool, index) => (
        <div key={tool.id} className="tool-card glass-card">
          <div className="tool-header">
            <div className="tool-logo">
              <img src={tool.logo} alt={tool.name} />
            </div>
            <div className="tool-badge">
              <span>{tool.category}</span>
            </div>
          </div>
          
          <div className="tool-content">
            <h3 className="tool-name">{tool.name}</h3>
            <p className="tool-description">{tool.description}</p>
            
            <div className="tool-features">
              {tool.features.map((feature, i) => (
                <span key={i} className="tool-feature">
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div className="tool-footer">
            <div className="tool-pricing">
              <span className="price">{tool.price}</span>
              <span className="price-period">{tool.period}</span>
            </div>
            
            <button className="tool-cta">
              <span>Išbandyti</span>
              <Icon name="external-link" />
            </button>
          </div>
          
          {/* Hover effect overlay */}
          <div className="tool-overlay"></div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### **4. Testimonials Section - Carousel**
```jsx
<section className="testimonials-section">
  <div className="testimonials-background">
    <div className="gradient-orb orb-1"></div>
    <div className="gradient-orb orb-2"></div>
  </div>
  
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">
        Ką sako mūsų <span className="gradient-text">studentai</span>
      </h2>
    </div>

    <div className="testimonials-carousel">
      <div className="testimonials-track">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card glass-card">
            <div className="testimonial-content">
              <div className="testimonial-quote">
                <Icon name="quote" className="quote-icon" />
                <p>{testimonial.content}</p>
              </div>
              
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                </div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-rating">
              {[1,2,3,4,5].map(star => (
                <Icon key={star} name="star" className="star filled" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

## 🔧 **ADMIN PANEL TRANSFORMATION**

### **1. Modern Sidebar**
```jsx
<aside className="admin-sidebar">
  <div className="sidebar-header">
    <div className="logo-container">
      <img src="/logo.svg" alt="Ponas Obuolys" className="logo" />
      <span className="logo-text gradient-text">Admin</span>
    </div>
    
    <button className="sidebar-toggle">
      <Icon name="menu" />
    </button>
  </div>

  <nav className="sidebar-nav">
    <div className="nav-section">
      <div className="nav-section-title">Pagrindinis</div>
      <div className="nav-items">
        {mainNavItems.map(item => (
          <NavItem key={item.id} {...item} />
        ))}
      </div>
    </div>
    
    <div className="nav-section">
      <div className="nav-section-title">Turinys</div>
      <div className="nav-items">
        {contentNavItems.map(item => (
          <NavItem key={item.id} {...item} />
        ))}
      </div>
    </div>
    
    <div className="nav-section">
      <div className="nav-section-title">Sistema</div>
      <div className="nav-items">
        {systemNavItems.map(item => (
          <NavItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  </nav>

  {/* User Profile */}
  <div className="sidebar-footer">
    <div className="user-profile glass-card">
      <div className="user-avatar">
        <img src={user.avatar} alt={user.name} />
        <div className="user-status"></div>
      </div>
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-role">{user.role}</div>
      </div>
      <button className="user-menu">
        <Icon name="more-vertical" />
      </button>
    </div>
  </div>
</aside>
```

### **2. Dashboard Overview**
```jsx
<div className="dashboard-overview">
  {/* Stats Cards */}
  <div className="stats-grid">
    {stats.map((stat, index) => (
      <div key={index} className="stat-card glass-card">
        <div className="stat-header">
          <div className="stat-icon-container">
            <Icon name={stat.icon} className="stat-icon" />
          </div>
          <div className="stat-trend">
            <Icon 
              name={stat.trend > 0 ? "trending-up" : "trending-down"} 
              className={stat.trend > 0 ? "trend-up" : "trend-down"}
            />
            <span>{Math.abs(stat.trend)}%</span>
          </div>
        </div>
        
        <div className="stat-content">
          <div className="stat-number">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
        
        <div className="stat-chart">
          <MiniChart data={stat.chartData} />
        </div>
      </div>
    ))}
  </div>

  {/* Charts Section */}
  <div className="charts-grid">
    <div className="chart-card glass-card">
      <div className="chart-header">
        <h3>Vartotojų aktyvumas</h3>
        <div className="chart-controls">
          <select className="chart-period">
            <option value="7d">7 dienos</option>
            <option value="30d">30 dienų</option>
            <option value="3m">3 mėnesiai</option>
          </select>
        </div>
      </div>
      <div className="chart-content">
        <LineChart data={userActivityData} />
      </div>
    </div>
    
    <div className="chart-card glass-card">
      <div className="chart-header">
        <h3>Populiariausi kursai</h3>
      </div>
      <div className="chart-content">
        <DonutChart data={coursesData} />
      </div>
    </div>
  </div>

  {/* Recent Activity */}
  <div className="activity-section">
    <div className="activity-card glass-card">
      <div className="activity-header">
        <h3>Paskutinė veikla</h3>
        <button className="activity-filter">
          <Icon name="filter" />
          <span>Filtruoti</span>
        </button>
      </div>
      
      <div className="activity-list">
        {recentActivities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">
              <Icon name={activity.icon} />
            </div>
            <div className="activity-content">
              <div className="activity-description">
                {activity.description}
              </div>
              <div className="activity-time">
                {activity.timestamp}
              </div>
            </div>
            <div className="activity-status">
              <span className={`status ${activity.status}`}>
                {activity.statusText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

### **3. Advanced Data Tables**
```jsx
<div className="data-table-container">
  <div className="table-header">
    <div className="table-title">
      <h2>Publikacijos</h2>
      <span className="table-count">{publications.length} įrašai</span>
    </div>
    
    <div className="table-actions">
      <div className="table-search">
        <Icon name="search" className="search-icon" />
        <input 
          type="text" 
          placeholder="Ieškoti publikacijų..."
          className="search-input"
        />
      </div>
      
      <div className="table-filters">
        <button className="filter-button">
          <Icon name="filter" />
          <span>Filtrai</span>
          <span className="filter-count">3</span>
        </button>
      </div>
      
      <button className="btn-primary">
        <Icon name="plus" />
        <span>Nauja publikacija</span>
      </button>
    </div>
  </div>

  <div className="table-wrapper glass-card">
    <table className="data-table">
      <thead>
        <tr>
          <th className="table-header-cell">
            <input type="checkbox" className="table-checkbox" />
          </th>
          <th className="table-header-cell sortable">
            <span>Pavadinimas</span>
            <Icon name="chevron-up-down" />
          </th>
          <th className="table-header-cell sortable">
            <span>Autorius</span>
            <Icon name="chevron-up-down" />
          </th>
          <th className="table-header-cell sortable">
            <span>Data</span>
            <Icon name="chevron-up-down" />
          </th>
          <th className="table-header-cell">Statusas</th>
          <th className="table-header-cell">Veiksmai</th>
        </tr>
      </thead>
      <tbody>
        {publications.map((publication, index) => (
          <tr key={publication.id} className="table-row">
            <td className="table-cell">
              <input type="checkbox" className="table-checkbox" />
            </td>
            <td className="table-cell">
              <div className="publication-title">
                <div className="title-main">{publication.title}</div>
                <div className="title-meta">{publication.excerpt}</div>
              </div>
            </td>
            <td className="table-cell">
              <div className="author-info">
                <img src={publication.author.avatar} className="author-avatar" />
                <span>{publication.author.name}</span>
              </div>
            </td>
            <td className="table-cell">
              <div className="date-info">
                <div className="date-main">
                  {formatDate(publication.createdAt)}
                </div>
                <div className="date-relative">
                  {getRelativeTime(publication.createdAt)}
                </div>
              </div>
            </td>
            <td className="table-cell">
              <span className={`status-badge ${publication.status}`}>
                {publication.statusText}
              </span>
            </td>
            <td className="table-cell">
              <div className="action-buttons">
                <button className="action-button view">
                  <Icon name="eye" />
                </button>
                <button className="action-button edit">
                  <Icon name="edit" />
                </button>
                <button className="action-button delete">
                  <Icon name="trash" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="table-pagination">
    <div className="pagination-info">
      Rodoma {startIndex}-{endIndex} iš {totalCount} įrašų
    </div>
    
    <div className="pagination-controls">
      <button className="pagination-button" disabled={currentPage === 1}>
        <Icon name="chevron-left" />
      </button>
      
      {paginationPages.map(page => (
        <button 
          key={page}
          className={`pagination-button ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
      
      <button className="pagination-button" disabled={currentPage === totalPages}>
        <Icon name="chevron-right" />
      </button>
    </div>
  </div>
</div>
```

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoint Sistema**
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;   /* Small devices */
  --breakpoint-md: 768px;   /* Medium devices */
  --breakpoint-lg: 1024px;  /* Large devices */
  --breakpoint-xl: 1280px;  /* Extra large devices */
  --breakpoint-2xl: 1536px; /* Ultra wide */
}

/* Media Queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### **Mobile Navigation**
```jsx
<nav className="mobile-nav">
  <div className="mobile-nav-header">
    <div className="mobile-logo">
      <img src="/logo.svg" alt="Ponas Obuolys" />
    </div>
    <button className="mobile-nav-toggle">
      <Icon name="menu" />
    </button>
  </div>

  <div className="mobile-nav-menu">
    <div className="mobile-nav-items">
      {navItems.map(item => (
        <a key={item.id} href={item.href} className="mobile-nav-item">
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </a>
      ))}
    </div>
    
    <div className="mobile-nav-footer">
      <button className="mobile-cta">
        Pradėti mokytis
      </button>
    </div>
  </div>
</nav>
```

### **Tablet Optimizations**
```css
/* Tablet specific adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero-card {
    max-width: 600px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tools-masonry {
    column-count: 2;
  }
  
  .admin-sidebar {
    width: 280px;
  }
}
```

---

## 🎯 **IMPLEMENTACIJOS PLANAS**

### **Phase 1: Foundation (Savaitė 1-2)**
- [ ] Spalvų sistemos implementacija
- [ ] Tipografijos atnaujinimas
- [ ] Bazinių komponentų kūrimas (glassmorphism, neumorphism)
- [ ] Grid ir spacing sistemų diegimas

### **Phase 2: Core Components (Savaitė 3-4)**
- [ ] Modern navigation implementacija
- [ ] Hero section redesign
- [ ] Cards sistema (tools, articles, courses)
- [ ] Form components modernizacija

### **Phase 3: Advanced Features (Savaitė 5-6)**
- [ ] Animacijų sistema
- [ ] Micro-interactions
- [ ] Loading states ir skeleton screens
- [ ] Dark/light mode toggle

### **Phase 4: Homepage Transformation (Savaitė 7-8)**
- [ ] Hero section su particles
- [ ] Features section redesign
- [ ] Tools masonry layout
- [ ] Testimonials carousel

### **Phase 5: Admin Panel Modernization (Savaitė 9-10)**
- [ ] Sidebar redesign
- [ ] Dashboard overview
- [ ] Advanced data tables
- [ ] Charts ir analytics

### **Phase 6: Polish & Optimization (Savaitė 11-12)**
- [ ] Performance optimization
- [ ] Mobile optimizations
- [ ] Cross-browser testing
- [ ] Final polish ir bug fixes

---

## 🚀 **TECHNOLOGIJŲ STECKAS**

### **Core Technologies**
- **React 18** - Modern React features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Advanced animations
- **Radix UI** - Accessible primitives

### **Animation Libraries**
- **Framer Motion** - Page transitions, gestures
- **React Spring** - Physics-based animations
- **GSAP** - Complex timeline animations
- **Lottie React** - After Effects animations

### **UI Enhancement**
- **React Hook Form** - Form management
- **React Query** - Data fetching
- **Lucide React** - Modern icons
- **React Intersection Observer** - Scroll animations

### **Charts & Visualization**
- **Recharts** - React charts library
- **D3.js** - Custom visualizations
- **React Chartjs-2** - Chart.js integration

---

## 📐 **DIZAINO PRINCIPAI**

### **1. Hierarchy & Structure**
- Aiškus vizualinis hierarchijos sistema
- Consistent spacing ir alignment
- Logical content flow

### **2. Color Psychology**
- Mėlyna - technologijos, patikimumas
- Violetinė - kūrybiškumas, inovacijos
- Žalia - augimas, sėkmė
- Gradientai - modernumas, dinamika

### **3. Typography**
- 3-4 font variants maximum
- Consistent line heights
- Proper font pairing
- Accessibility standards

### **4. User Experience**
- Intuitive navigation
- Fast loading times
- Clear call-to-actions
- Mobile-first design

### **5. Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios

---

## 🔄 **MAINTENANCE & UPDATES**

### **Regular Updates**
- Quarterly design reviews
- Performance audits
- User feedback integration
- Technology stack updates

### **Content Updates**
- Seasonal color adjustments
- Feature additions
- Content refresh
- A/B testing for improvements

### **Performance Monitoring**
- Core Web Vitals tracking
- User interaction analytics
- Conversion rate optimization
- Error tracking ir reporting

---

## 📊 **SUCCESS METRICS**

### **Design Metrics**
- Page load speed < 2s
- Bounce rate < 30%
- Session duration > 3 min
- Mobile usability score > 95

### **User Engagement**
- Course enrollment +40%
- Tool exploration +60%
- Newsletter signups +50%
- Social sharing +80%

### **Business Impact**
- Lead generation +35%
- Brand recognition +70%
- User satisfaction > 4.5/5
- Return visitor rate +45%

---

## 🎨 **PRIEDAI**

### **Color Palette Reference**
```css
/* Export all color variables for design tools */
:export {
  primary50: #eff6ff;
  primary100: #dbeafe;
  primary500: #3b82f6;
  primary600: #2563eb;
  primary700: #1d4ed8;
  primary900: #1e3a8a;
  
  secondary50: #faf5ff;
  secondary100: #f3e8ff;
  secondary500: #8b5cf6;
  secondary600: #7c3aed;
  secondary700: #6d28d9;
  secondary900: #4c1d95;
  
  accent50: #ecfdf5;
  accent100: #d1fae5;
  accent500: #10b981;
  accent600: #059669;
  accent700: #047857;
  accent900: #064e3b;
}
```

### **Component Library Structure**
```
components/
├── ui/
│   ├── glassmorphism/
│   ├── neumorphism/
│   ├── animations/
│   └── charts/
├── layout/
│   ├── navigation/
│   ├── containers/
│   └── sections/
├── forms/
│   ├── inputs/
│   ├── buttons/
│   └── validation/
└── admin/
    ├── dashboard/
    ├── tables/
    └── charts/
```

---

**© 2025 Ponas Obuolys - Modern AI Education Platform Design System**

*Šis dokumentas yra gyvas ir bus atnaujinamas kartu su projekto vystymusi.*