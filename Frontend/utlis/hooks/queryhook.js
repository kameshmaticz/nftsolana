import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

export default function Queryhook({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}