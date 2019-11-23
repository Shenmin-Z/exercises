export async function printResult<A>(resultPromise: Promise<A>) {
  console.log(await resultPromise);
}
