<template>
  <div class="nav-sidebar flex-shrink-0">
    <!-- Logo -->
    <div class="logo">
      <i class="pi pi-chart-line"></i>
      <div style="font-size: 0.75rem; margin-top: 0.25rem;">GTRACK</div>
    </div>

    <!-- Navigation Items -->
    <div class="nav-items">
      <div class="nav-item" title="Home">
        <i class="pi pi-home"></i>
      </div>
      <div class="nav-item" title="New Scan">
        <i class="pi pi-plus-circle"></i>
      </div>
      <div class="nav-item" title="My Scans">
        <i class="pi pi-list"></i>
      </div>
      <div class="nav-item" title="AI Scan Insights">
        <i class="pi pi-chart-line"></i>
      </div>
      <div class="nav-item active" title="Scheduled Scans">
        <i class="pi pi-calendar"></i>
      </div>
      <div class="nav-item" title="Track Competitors">
        <i class="pi pi-users"></i>
      </div>
    </div>

    <!-- Credits Section -->
    <div class="credits-section">
      <div class="credit-item">
        <div class="label">Q Scan Credits</div>
        <div class="value">{{ scanCredits.used }}</div>
        <div class="total">{{ scanCredits.total }} total</div>
      </div>
      <div class="credit-item">
        <div class="label">AI Tokens</div>
        <div class="value">{{ aiTokens.used }}</div>
        <div class="total">{{ aiTokens.total }} total</div>
      </div>
    </div>

    <!-- User Avatar -->
    <div class="user-avatar" title="User Profile">
      AC
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scanCredits = ref({
  used: '158236',
  total: '200000'
})

const aiTokens = ref({
  used: '14237',
  total: '500000'
})
</script>

<style scoped>
.nav-sidebar {
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-sidebar .logo {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1.5rem 0;
  text-align: center;
}

.nav-sidebar .nav-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  width: 100%;
}

.nav-sidebar .nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
  color: rgba(255, 255, 255, 0.7);
}

.nav-sidebar .nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-sidebar .nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-sidebar .nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: white;
}

.nav-sidebar .nav-item i {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.nav-sidebar .credits-section {
  padding: 1rem 0.5rem;
  width: 100%;
}

.nav-sidebar .credit-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.nav-sidebar .credit-item .label {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
}

.nav-sidebar .credit-item .value {
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
}

.nav-sidebar .credit-item .total {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
}

.nav-sidebar .user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.75rem 0;
  cursor: pointer;
  font-weight: bold;
  color: #1e3a8a;
}
</style>
