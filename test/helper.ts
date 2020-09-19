export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(function(resolve) {
    setTimeout(() => {
      /** 返回伪造的xhr对象 */
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
