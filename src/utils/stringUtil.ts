export function replaceStringStorageApi(input: string) {
  return input.replace('http://localhost:8001http://storage-api:8001/', 'http://localhost:8001/')
}