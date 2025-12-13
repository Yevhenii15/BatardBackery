
export function useApiClient() {

  const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;

  return $fetch.create({
    credentials: "include",
    headers,
  });
}
