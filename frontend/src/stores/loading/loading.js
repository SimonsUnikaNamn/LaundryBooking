import create from 'zustand'
 
const [loadingStore] = create(set => ({
  loading: false,
  setLoading: (isLoading) => set(state => ({ loading: isLoading })),
}))

export default loadingStore