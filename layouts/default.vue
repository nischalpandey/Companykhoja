<template>
  <div class="min-h-screen bg-gray-50 dark:bg-surface-950 dark:text-surface-100">
    <AppHeader />
    <main class="pt-16">
      <slot />
    </main>
    <AppFooter />
    <ScrollToTop />
    <CommandPalette />
    <ToastContainer />
  </div>
</template>
