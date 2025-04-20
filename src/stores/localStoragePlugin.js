import { createPinia } from 'pinia';

const localStoragePlugin = (context) => {
  const { store } = context;
  const storeId = store.$id;

  const data = localStorage.getItem(storeId);
  if (data) {
    store.$patch(JSON.parse(data));
  }

  store.$subscribe((mutation, state) => {
    localStorage.setItem(storeId, JSON.stringify(state));
  });
};

const pinia = createPinia();
pinia.use(localStoragePlugin);

export default pinia;
