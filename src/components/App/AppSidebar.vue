<script setup>

  const sidebarNavItems = [
    {
      title: 'Favorites',
      to: {name: 'favorites'},
      icon: 'icons/tv-fill.svg',
      class: 'bi bi-tv-fill',
      svg_path: 'M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5M2 2h12s2 0 2 2v6s0 2-2 2H2s-2 0-2-2V4s0-2 2-2'
    },
    {
      title: 'Channels',
      to: {name: 'channels'},
      icon: 'icons/collection-fill.svg',
      class: 'bi bi-collection-fill',
      svg_path: 'M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1'
    },
    {
      title: 'Tags',
      to: {name: 'tags'},
      icon: 'icons/collection-fill.svg',
      class: 'bi bi-collection-fill',
      svg_path: 'M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z'
    }
  ]
</script>
<template>
  <nav class="col-md-2 d-md-block bg-light sidebar">
    <div class="sidebar-sticky">
      <ul class="nav flex-column mt-3">
        <li v-for="sidebarNavItem in sidebarNavItems" :key="sidebarNavItem.title" class="nav-item text-nowrap">
          <router-link :to="sidebarNavItem.to" active-class="active" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" :class="sidebarNavItem.class" viewBox="0 0 24 24">
              <path :d="sidebarNavItem.svg_path"/>
            </svg>
            {{ sidebarNavItem.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<style scoped>
  .sidebar {
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100; /* Behind the navbar */
    padding: 0;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
  }

  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 48px; /* Height of navbar */
    height: calc(100vh - 48px);
    padding-top: .5rem;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
  }

  .sidebar .nav-link {
    font-weight: 500;
    color: #333;
  }

  .sidebar .nav-link .feather {
    margin-right: 4px;
    color: #999;
  }

  .sidebar .nav-link.active {
    font-weight: 800;
    color: var(--active-link-color)
  }

  .sidebar .nav-link:hover {
    font-weight: 800;
  }

  .sidebar .nav-link:hover .feather,
  .sidebar .nav-link.active .feather {
    color: inherit;
  }

</style>
