import { useQueryClient } from "@tanstack/react-query"


const fetchQueriesHook = () => {
  const queryClient = useQueryClient()
  
  const fetchQueryClient = (key: any[]) => {
    queryClient.invalidateQueries({ queryKey: key })
  }

  return (
    fetchQueryClient
  )
}

export default fetchQueriesHook